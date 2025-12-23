import React, { useState, useEffect, useRef } from 'react';
import { smartAnimeApi } from '../utils/advancedAnimeApi';
import { setupHlsPlayer, changeQuality, getQualityLevels, downloadVideo, formatDuration } from '../utils/streamProxy';
import './AnimePlayer.css';

/**
 * COMPLETE ANIME VIDEO PLAYER
 * Features:
 * - Multi-source streaming (HiAnime, Aniwatch, Consumet)
 * - Quality selection (1080p, 720p, 480p, 360p, Auto)
 * - Sub/Dub support
 * - Skip Intro/Outro
 * - Subtitles support
 * - Download episodes
 * - Next episode auto-play
 * - Server selection
 * - Speed control
 * - Fullscreen
 * - Picture-in-Picture
 */

const AnimePlayer = ({ animeId, episodeNumber, anilistId }) => {
  // Player state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [streamData, setStreamData] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  
  // Player controls
  const [audioType, setAudioType] = useState('sub'); // 'sub' or 'dub'
  const [server, setServer] = useState('hd-1');
  const [availableServers, setAvailableServers] = useState({ sub: [], dub: [] });
  const [qualities, setQualities] = useState([]);
  const [currentQuality, setCurrentQuality] = useState(-1); // -1 = auto
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  
  // UI state
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showSkipIntro, setShowSkipIntro] = useState(false);
  const [showSkipOutro, setShowSkipOutro] = useState(false);
  
  // Refs
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const containerRef = useRef(null);

  // Load episodes and current episode
  useEffect(() => {
    loadEpisodes();
  }, [animeId]);

  // Load streaming sources when episode changes
  useEffect(() => {
    if (currentEpisode) {
      loadStreamingSources();
    }
  }, [currentEpisode, audioType, server]);

  // Update skip intro/outro visibility
  useEffect(() => {
    if (streamData?.intro && currentTime >= streamData.intro.start && currentTime <= streamData.intro.end) {
      setShowSkipIntro(true);
    } else {
      setShowSkipIntro(false);
    }

    if (streamData?.outro && currentTime >= streamData.outro.start && currentTime <= streamData.outro.end) {
      setShowSkipOutro(true);
    } else {
      setShowSkipOutro(false);
    }
  }, [currentTime, streamData]);

  // Load episodes list
  const loadEpisodes = async () => {
    try {
      setLoading(true);
      const episodesData = await smartAnimeApi.getAnime(animeId, anilistId);
      
      if (episodesData.hianime) {
        const eps = episodesData.hianime.episodes || [];
        setEpisodes(eps);
        
        // Set current episode
        const episode = eps.find(ep => ep.episodeNumber === episodeNumber) || eps[0];
        setCurrentEpisode(episode);
      }
    } catch (err) {
      setError('Failed to load episodes');
      console.error(err);
    }
  };

  // Load streaming sources
  const loadStreamingSources = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get available servers first
      const serversData = await smartAnimeApi.getAnime(animeId);
      if (serversData.hianime) {
        setAvailableServers(serversData.hianime.servers || { sub: [], dub: [] });
      }

      // Get streaming sources
      const sources = await smartAnimeApi.getStreamingSources(
        currentEpisode.id,
        server,
        audioType
      );

      if (sources.success && sources.data) {
        setStreamData(sources.data);
        
        // Setup video player
        if (videoRef.current && sources.data.link) {
          // Destroy previous HLS instance
          if (hlsRef.current) {
            hlsRef.current.destroy();
          }

          // Setup new player
          hlsRef.current = setupHlsPlayer(
            videoRef.current,
            sources.data.link.file,
            {
              referer: 'https://megacloud.tv',
              autoplay: true,
              onQualityChange: (levels) => {
                setQualities(levels);
              },
              onError: (err) => {
                setError('Streaming error. Try different server.');
                console.error('HLS Error:', err);
              }
            }
          );
        }
        
        setLoading(false);
      } else {
        setError('No streaming sources available. Try different server.');
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to load streaming sources');
      setLoading(false);
      console.error(err);
    }
  };

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleVolumeChange = () => setVolume(video.volume);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('volumechange', handleVolumeChange);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('volumechange', handleVolumeChange);
    };
  }, []);

  // Auto-hide controls
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  // Player controls
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value / 100;
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
    }
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

  const changeSpeed = (speed) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
    }
  };

  const handleQualityChange = (qualityIndex) => {
    if (hlsRef.current) {
      changeQuality(hlsRef.current, qualityIndex);
      setCurrentQuality(qualityIndex);
    }
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  const togglePictureInPicture = async () => {
    if (videoRef.current) {
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await videoRef.current.requestPictureInPicture();
        }
      } catch (err) {
        console.error('PIP error:', err);
      }
    }
  };

  const handleDownload = () => {
    if (streamData?.link?.file) {
      downloadVideo(
        streamData.link.file,
        `${animeId}-episode-${episodeNumber}.mp4`
      );
    }
  };

  const playNextEpisode = () => {
    const currentIndex = episodes.findIndex(ep => ep.episodeNumber === episodeNumber);
    if (currentIndex < episodes.length - 1) {
      const nextEpisode = episodes[currentIndex + 1];
      setCurrentEpisode(nextEpisode);
    }
  };

  const playPreviousEpisode = () => {
    const currentIndex = episodes.findIndex(ep => ep.episodeNumber === episodeNumber);
    if (currentIndex > 0) {
      const prevEpisode = episodes[currentIndex - 1];
      setCurrentEpisode(prevEpisode);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="anime-player-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="anime-player-video"
        onClick={togglePlayPause}
      >
        {/* Subtitles */}
        {streamData?.tracks?.map((track, index) => (
          track.kind === 'captions' && (
            <track
              key={index}
              kind="subtitles"
              src={track.file}
              label={track.label}
              srcLang={track.label?.toLowerCase()}
              default={track.default}
            />
          )
        ))}
      </video>

      {/* Loading Overlay */}
      {loading && (
        <div className="player-loading">
          <div className="spinner"></div>
          <p>Loading stream...</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="player-error">
          <p>⚠️ {error}</p>
          <button onClick={loadStreamingSources}>Retry</button>
        </div>
      )}

      {/* Skip Intro Button */}
      {showSkipIntro && (
        <button className="skip-button skip-intro" onClick={skipIntro}>
          Skip Intro →
        </button>
      )}

      {/* Skip Outro Button */}
      {showSkipOutro && (
        <button className="skip-button skip-outro" onClick={skipOutro}>
          Skip Outro →
        </button>
      )}

      {/* Player Controls */}
      {showControls && (
        <div className="player-controls">
          {/* Top Bar */}
          <div className="controls-top">
            <div className="episode-info">
              <h3>{currentEpisode?.title || `Episode ${episodeNumber}`}</h3>
            </div>
            
            {/* Audio Type Selector */}
            <div className="audio-selector">
              <button 
                className={audioType === 'sub' ? 'active' : ''}
                onClick={() => setAudioType('sub')}
              >
                SUB
              </button>
              <button 
                className={audioType === 'dub' ? 'active' : ''}
                onClick={() => setAudioType('dub')}
              >
                DUB
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress-container">
            <input
              type="range"
              min="0"
              max="100"
              value={(currentTime / duration) * 100 || 0}
              onChange={handleSeek}
              className="progress-bar"
            />
            <div className="time-display">
              <span>{formatDuration(currentTime)}</span>
              <span>{formatDuration(duration)}</span>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="controls-bottom">
            {/* Left Controls */}
            <div className="controls-left">
              {/* Play/Pause */}
              <button onClick={togglePlayPause}>
                {isPlaying ? '⏸' : '▶'}
              </button>

              {/* Previous/Next Episode */}
              <button onClick={playPreviousEpisode}>⏮</button>
              <button onClick={playNextEpisode}>⏭</button>

              {/* Volume */}
              <div className="volume-control">
                <button onClick={() => handleVolumeChange({ target: { value: volume === 0 ? 100 : 0 } })}>
                  {volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume * 100}
                  onChange={handleVolumeChange}
                  className="volume-slider"
                />
              </div>

              {/* Time */}
              <span className="time-text">
                {formatDuration(currentTime)} / {formatDuration(duration)}
              </span>
            </div>

            {/* Right Controls */}
            <div className="controls-right">
              {/* Speed Control */}
              <select 
                value={playbackSpeed} 
                onChange={(e) => changeSpeed(parseFloat(e.target.value))}
                className="speed-selector"
              >
                <option value="0.25">0.25x</option>
                <option value="0.5">0.5x</option>
                <option value="0.75">0.75x</option>
                <option value="1">1x</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
                <option value="1.75">1.75x</option>
                <option value="2">2x</option>
              </select>

              {/* Quality Selector */}
              {qualities.length > 0 && (
                <select 
                  value={currentQuality} 
                  onChange={(e) => handleQualityChange(parseInt(e.target.value))}
                  className="quality-selector"
                >
                  <option value="-1">Auto</option>
                  {qualities.map((quality) => (
                    <option key={quality.index} value={quality.index}>
                      {quality.label}
                    </option>
                  ))}
                </select>
              )}

              {/* Server Selector */}
              <select 
                value={server} 
                onChange={(e) => setServer(e.target.value)}
                className="server-selector"
              >
                {availableServers[audioType]?.map((srv) => (
                  <option key={srv.serverId} value={srv.serverName}>
                    {srv.serverName}
                  </option>
                ))}
              </select>

              {/* Download */}
              <button onClick={handleDownload} title="Download Episode">
                ⬇️
              </button>

              {/* Picture-in-Picture */}
              <button onClick={togglePictureInPicture} title="Picture-in-Picture">
                📺
              </button>

              {/* Fullscreen */}
              <button onClick={toggleFullscreen} title="Fullscreen">
                ⛶
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimePlayer;
