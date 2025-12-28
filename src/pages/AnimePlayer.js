import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { hianime, switchServer, getCurrentServer, getAllServers } from '../utils/hianimeApi';
import Hls from 'hls.js';

const AnimePlayer = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const episodeId = searchParams.get('episode');
  const episodeNumber = searchParams.get('ep');
  
  const [anime, setAnime] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [servers, setServers] = useState({ sub: [], dub: [] });
  const [currentServer, setCurrentServer] = useState('hd-1');
  const [audioType, setAudioType] = useState('sub');
  const [streamData, setStreamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [apiServer, setApiServer] = useState(getCurrentServer());
  
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    loadAnimeData();
  }, [id]);

  useEffect(() => {
    if (episodeId) {
      loadEpisodeData();
    }
  }, [episodeId, currentServer, audioType, apiServer]);

  const loadAnimeData = async () => {
    try {
      setLoading(true);
      const [animeData, episodesData] = await Promise.all([
        hianime.details(id),
        hianime.episodes(id)
      ]);
      setAnime(animeData);
      setEpisodes(episodesData.episodes || []);
      
      if (!episodeId && episodesData.episodes?.length > 0) {
        const firstEp = episodesData.episodes[0];
        setSearchParams({ episode: firstEp.id, ep: firstEp.episodeNumber });
      }
    } catch (error) {
      console.error('Load anime error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEpisodeData = async () => {
    try {
      setVideoLoading(true);
      const [serversData, streamData] = await Promise.all([
        hianime.servers(episodeId),
        hianime.stream(episodeId, currentServer, audioType)
      ]);
      
      setServers(serversData);
      setStreamData(streamData);
      
      if (streamData?.link?.file) {
        initializePlayer(streamData.link.file, streamData.tracks || []);
      } else {
        setVideoLoading(false);
      }
    } catch (error) {
      console.error('Load episode error:', error);
      setVideoLoading(false);
    }
  };

  const initializePlayer = (url, tracks) => {
    const video = videoRef.current;
    if (!video) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        enableWorker: true,
        //-1 for auto quality selection
        startLevel: -1
      });
      
      hls.loadSource(url);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(e => console.log('Autoplay prevented'));
        setPlaying(true);
        setVideoLoading(false);
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          console.error('HLS error:', data);
          handleHlsError();
        }
      });

      hlsRef.current = hls;
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(e => console.log('Autoplay prevented'));
        setPlaying(true);
        setVideoLoading(false);
      });
    } else {
      setVideoLoading(false);
    }

    const oldTracks = video.querySelectorAll('track');
    oldTracks.forEach(track => track.remove());

    tracks.forEach((track, index) => {
      if (track.kind === 'captions' || track.kind === 'subtitles') {
        const trackElement = document.createElement('track');
        trackElement.kind = track.kind;
        trackElement.label = track.label || `Subtitle ${index + 1}`;
        trackElement.srclang = track.label?.toLowerCase() || 'en';
        trackElement.src = track.file;
        if (track.default) trackElement.default = true;
        video.appendChild(trackElement);
      }
    });
  };

  const handleHlsError = () => {
    const availableApiServers = getAllServers();
    const currentApiServerIndex = apiServer;
    const nextApiServerIndex = (currentApiServerIndex + 1) % availableApiServers.length;
    
    if (nextApiServerIndex !== apiServer) {
      handleApiServerChange(nextApiServerIndex);
    } else {
      console.error('All API servers failed.');
    }
  };

  const handleServerChange = (serverName) => {
    setCurrentServer(serverName);
  };

  const handleApiServerChange = (index) => {
    switchServer(index);
    setApiServer(index);
    loadEpisodeData();
  };

  const handleEpisodeChange = (episode) => {
    setSearchParams({ episode: episode.id, ep: episode.episodeNumber });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const availableServers = audioType === 'sub' ? servers.sub : servers.dub;
  const allApiServers = getAllServers();

  return (
    <div className="min-h-screen pt-16 bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        <div className="relative bg-black rounded-lg overflow-hidden mb-6">
          <video
            ref={videoRef}
            className="w-full aspect-video"
            controls
            controlsList="nodownload"
            playsInline
          />
          
          {videoLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">{anime?.title}</h1>
          <p className="text-gray-400">
            Episode {episodeNumber} {episodes.find(e => e.id === episodeId)?.title && `- ${episodes.find(e => e.id === episodeId).title}`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-4 mb-4">
              <h3 className="text-lg font-semibold text-white">Audio & Servers</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setAudioType('sub')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    audioType === 'sub' ? 'bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  SUB
                </button>
                <button
                  onClick={() => setAudioType('dub')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    audioType === 'dub' ? 'bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  DUB
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {availableServers.map((server) => (
                <button
                  key={server.serverName}
                  onClick={() => handleServerChange(server.serverName.toLowerCase())}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    currentServer === server.serverName.toLowerCase() ? 'bg-yellow-500 text-black' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {server.serverName}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">API Servers</h3>
            <p className="text-xs text-gray-400 mb-3">If video fails, try another API server.</p>
            <div className="flex flex-wrap gap-2">
              {allApiServers.map((server, index) => (
                <button
                  key={index}
                  onClick={() => handleApiServerChange(index)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    apiServer === index ? 'bg-yellow-500 text-black' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  API {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Episodes</h3>
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2 max-h-80 overflow-y-auto">
            {episodes.map((episode) => (
              <button
                key={episode.id}
                onClick={() => handleEpisodeChange(episode)}
                className={`aspect-square rounded-lg font-semibold transition-all flex items-center justify-center text-center p-1 ${
                  episodeId === episode.id
                    ? 'bg-red-600 text-white scale-105'
                    : 'bg-gray-700 hover:bg-gray-600'
                } ${episode.isFiller ? 'border-2 border-yellow-500' : ''}`}
                title={episode.title || `Episode ${episode.episodeNumber}`}
              >
                {episode.episodeNumber}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimePlayer;
