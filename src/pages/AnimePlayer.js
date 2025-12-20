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
      const [animeData, episodesData] = await Promise.all([
        hianime.details(id),
        hianime.episodes(id)
      ]);
      setAnime(animeData);
      setEpisodes(episodesData.episodes || []);
      
      // Auto-load first episode if no episode specified
      if (!episodeId && episodesData.episodes?.length > 0) {
        const firstEp = episodesData.episodes[0];
        setSearchParams({ episode: firstEp.id, ep: firstEp.episodeNumber });
      }
      setLoading(false);
    } catch (error) {
      console.error('Load anime error:', error);
      setLoading(false);
    }
  };

  const loadEpisodeData = async () => {
    try {
      setLoading(true);
      const [serversData, streamData] = await Promise.all([
        hianime.servers(episodeId),
        hianime.stream(episodeId, currentServer, audioType)
      ]);
      
      setServers(serversData);
      setStreamData(streamData);
      
      if (streamData?.link?.file) {
        initializePlayer(streamData.link.file, streamData.tracks || []);
      }
      setLoading(false);
    } catch (error) {
      console.error('Load episode error:', error);
      setLoading(false);
    }
  };

  const initializePlayer = (url, tracks) => {
    const video = videoRef.current;
    if (!video) return;

    // Cleanup previous instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        enableWorker: true
      });
      
      hls.loadSource(url);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(e => console.log('Autoplay prevented'));
        setPlaying(true);
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          console.error('HLS error:', data);
        }
      });

      hlsRef.current = hls;
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(e => console.log('Autoplay prevented'));
        setPlaying(true);
      });
    }

    // Add subtitles
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

  const skipIntro = () => {
    if (videoRef.current && streamData?.intro) {
      videoRef.current.currentTime = streamData.intro.end;
    }
  };

  const skipOutro = () => {
    if (videoRef.current && streamData?.outro) {
      videoRef.current.currentTime = streamData.outro.end;
    }
  };

  if (loading && !anime) {
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
        {/* Video Player */}
        <div className="relative bg-black rounded-lg overflow-hidden mb-6">
          <video
            ref={videoRef}
            className="w-full aspect-video"
            controls
            controlsList="nodownload"
            playsInline
          >
            Your browser does not support the video tag.
          </video>
          
          {/* Skip Buttons */}
          {streamData?.intro && (
            <button
              onClick={skipIntro}
              className="absolute bottom-24 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all"
            >
              Skip Intro →
            </button>
          )}
          {streamData?.outro && (
            <button
              onClick={skipOutro}
              className="absolute bottom-24 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all"
            >
              Skip Outro →
            </button>
          )}
        </div>

        {/* Info Bar */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">{anime?.title}</h1>
          <p className="text-gray-400">
            Episode {episodeNumber} {episodes.find(e => e.id === episodeId)?.title && `- ${episodes.find(e => e.id === episodeId).title}`}
          </p>
        </div>

        {/* Audio Type Switch */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setAudioType('sub')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              audioType === 'sub'
                ? 'bg-red-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            🎌 SUB
          </button>
          <button
            onClick={() => setAudioType('dub')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              audioType === 'dub'
                ? 'bg-red-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            🎙️ DUB
          </button>
        </div>

        {/* Streaming Servers */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">🎬 Streaming Servers</h3>
          <div className="flex flex-wrap gap-2">
            {availableServers.map((server, index) => (
              <button
                key={index}
                onClick={() => handleServerChange(server.serverName.toLowerCase())}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  currentServer === server.serverName.toLowerCase()
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                📡 {server.serverName}
              </button>
            ))}
          </div>
        </div>

        {/* API Servers */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">🌐 API Servers</h3>
          <p className="text-sm text-gray-400 mb-3">If the current server is not working, please try switching to other servers.</p>
          <div className="flex flex-wrap gap-2">
            {allApiServers.map((server, index) => (
              <button
                key={index}
                onClick={() => handleApiServerChange(index)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  apiServer === index
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                📡 Server {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Episodes List */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">📺 Episodes</h3>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 max-h-96 overflow-y-auto">
            {episodes.map((episode) => (
              <button
                key={episode.id}
                onClick={() => handleEpisodeChange(episode)}
                className={`aspect-square rounded-lg font-semibold transition-all ${
                  episodeId === episode.id
                    ? 'bg-red-600 text-white scale-110'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
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
