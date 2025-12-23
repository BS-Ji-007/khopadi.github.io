import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AnimePlayer from '../components/AnimePlayer';
import { hianimeApi } from '../utils/advancedAnimeApi';
import './WatchPage.css';

/**
 * WATCH PAGE - BUG FIXED VERSION
 * Fixes:
 * - ✅ Proper routing
 * - ✅ Episode selection
 * - ✅ State management
 * - ✅ Loading states
 */

const WatchPage = () => {
  const { animeId, episodeNumber } = useParams();
  const navigate = useNavigate();
  const [animeInfo, setAnimeInfo] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentEpisode, setCurrentEpisode] = useState(parseInt(episodeNumber) || 1);

  useEffect(() => {
    if (animeId) {
      loadAnimeData();
    }
  }, [animeId]);

  useEffect(() => {
    setCurrentEpisode(parseInt(episodeNumber) || 1);
  }, [episodeNumber]);

  const loadAnimeData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get anime info
      const data = await hianimeApi.info(animeId);
      
      if (data) {
        setAnimeInfo(data);
      }

      // Get episodes
      const episodesData = await hianimeApi.episodes(animeId);
      if (episodesData && episodesData.episodes) {
        setEpisodes(episodesData.episodes);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Failed to load anime data:', err);
      setError('Failed to load anime data');
      setLoading(false);
    }
  };

  const handleEpisodeSelect = (episodeNum) => {
    setCurrentEpisode(episodeNum);
    navigate(`/watch/${animeId}/${episodeNum}`);
  };

  if (loading) {
    return (
      <div className="watch-page-loading">
        <div className="spinner"></div>
        <p>Loading anime...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="watch-page-error">
        <p>⚠️ {error}</p>
        <button onClick={loadAnimeData}>Retry</button>
      </div>
    );
  }

  return (
    <div className="watch-page">
      {/* Video Player Section */}
      <div className="player-section">
        <AnimePlayer
          animeId={animeId}
          episodeNumber={currentEpisode}
          anilistId={animeInfo?.malId || null}
        />
      </div>

      {/* Anime Info Section */}
      {animeInfo && (
        <div className="anime-info-section">
          <div className="anime-header">
            {animeInfo.poster && (
              <img 
                src={animeInfo.poster} 
                alt={animeInfo.title}
                className="anime-poster"
                onError={(e) => e.target.style.display = 'none'}
              />
            )}
            <div className="anime-details">
              <h1>{animeInfo.title || 'Unknown Title'}</h1>
              {animeInfo.alternativeTitle && (
                <h2>{animeInfo.alternativeTitle}</h2>
              )}
              <div className="anime-meta">
                {animeInfo.type && (
                  <span className="meta-item">
                    <strong>Type:</strong> {animeInfo.type}
                  </span>
                )}
                {animeInfo.status && (
                  <span className="meta-item">
                    <strong>Status:</strong> {animeInfo.status}
                  </span>
                )}
                {episodes.length > 0 && (
                  <span className="meta-item">
                    <strong>Episodes:</strong> {episodes.length}
                  </span>
                )}
                {animeInfo.MAL_score && (
                  <span className="meta-item score">
                    ⭐ {animeInfo.MAL_score}
                  </span>
                )}
              </div>
              {animeInfo.genres && animeInfo.genres.length > 0 && (
                <div className="genres">
                  {animeInfo.genres.map((genre, index) => (
                    <span key={index} className="genre-tag">{genre}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Synopsis */}
          {animeInfo.synopsis && (
            <div className="synopsis">
              <h3>Synopsis</h3>
              <p>{animeInfo.synopsis}</p>
            </div>
          )}
        </div>
      )}

      {/* Episodes List Section */}
      {episodes.length > 0 && (
        <div className="episodes-section">
          <h3>Episodes ({episodes.length})</h3>
          <div className="episodes-grid">
            {episodes.map((episode) => (
              <div
                key={episode.episodeNumber}
                className={`episode-card ${
                  episode.episodeNumber === currentEpisode ? 'active' : ''
                }`}
                onClick={() => handleEpisodeSelect(episode.episodeNumber)}
              >
                <div className="episode-number">EP {episode.episodeNumber}</div>
                {episode.title && (
                  <div className="episode-title">{episode.title}</div>
                )}
                {episode.isFiller && (
                  <span className="filler-badge">Filler</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related/Recommended Section */}
      {animeInfo?.recommended && animeInfo.recommended.length > 0 && (
        <div className="recommended-section">
          <h3>Recommended Anime</h3>
          <div className="recommended-grid">
            {animeInfo.recommended.slice(0, 6).map((anime, index) => (
              <div 
                key={index} 
                className="recommended-card"
                onClick={() => navigate(`/watch/${anime.id}/1`)}
              >
                {anime.poster && (
                  <img 
                    src={anime.poster} 
                    alt={anime.title}
                    onError={(e) => e.target.style.display = 'none'}
                  />
                )}
                <div className="recommended-info">
                  <h4>{anime.title || 'Unknown'}</h4>
                  {anime.type && <p>{anime.type}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchPage;
