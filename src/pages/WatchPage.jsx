import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AnimePlayer from '../components/AnimePlayer';
import { smartAnimeApi } from '../utils/advancedAnimeApi';
import './WatchPage.css';

/**
 * COMPLETE WATCH PAGE
 * Usage: /watch/:animeId/:episodeNumber
 * Example: /watch/one-piece-100/1120
 */

const WatchPage = () => {
  const { animeId, episodeNumber } = useParams();
  const [animeInfo, setAnimeInfo] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentEpisode, setCurrentEpisode] = useState(parseInt(episodeNumber));

  useEffect(() => {
    loadAnimeData();
  }, [animeId]);

  const loadAnimeData = async () => {
    try {
      setLoading(true);
      
      // Get anime info
      const data = await smartAnimeApi.getAnime(animeId);
      
      if (data.hianime) {
        setAnimeInfo(data.hianime);
      }

      // Get episodes
      const episodesData = await smartAnimeApi.getAnime(animeId);
      if (episodesData.hianime?.episodes) {
        setEpisodes(episodesData.hianime.episodes);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to load anime data:', error);
      setLoading(false);
    }
  };

  const handleEpisodeSelect = (episodeNum) => {
    setCurrentEpisode(episodeNum);
    window.history.pushState(null, '', `/watch/${animeId}/${episodeNum}`);
  };

  if (loading) {
    return (
      <div className="watch-page-loading">
        <div className="spinner"></div>
        <p>Loading anime...</p>
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
      <div className="anime-info-section">
        <div className="anime-header">
          <img 
            src={animeInfo?.poster} 
            alt={animeInfo?.title}
            className="anime-poster"
          />
          <div className="anime-details">
            <h1>{animeInfo?.title}</h1>
            {animeInfo?.alternativeTitle && (
              <h2>{animeInfo.alternativeTitle}</h2>
            )}
            <div className="anime-meta">
              <span className="meta-item">
                <strong>Type:</strong> {animeInfo?.type}
              </span>
              <span className="meta-item">
                <strong>Status:</strong> {animeInfo?.status}
              </span>
              <span className="meta-item">
                <strong>Episodes:</strong> {animeInfo?.episodes?.eps || 'N/A'}
              </span>
              {animeInfo?.MAL_score && (
                <span className="meta-item score">
                  ⭐ {animeInfo.MAL_score}
                </span>
              )}
            </div>
            {animeInfo?.genres && (
              <div className="genres">
                {animeInfo.genres.map((genre, index) => (
                  <span key={index} className="genre-tag">{genre}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Synopsis */}
        {animeInfo?.synopsis && (
          <div className="synopsis">
            <h3>Synopsis</h3>
            <p>{animeInfo.synopsis}</p>
          </div>
        )}
      </div>

      {/* Episodes List Section */}
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
              <div className="episode-title">{episode.title}</div>
              {episode.isFiller && (
                <span className="filler-badge">Filler</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Related/Recommended Section */}
      {animeInfo?.recommended && animeInfo.recommended.length > 0 && (
        <div className="recommended-section">
          <h3>Recommended Anime</h3>
          <div className="recommended-grid">
            {animeInfo.recommended.slice(0, 6).map((anime, index) => (
              <div key={index} className="recommended-card">
                <img src={anime.poster} alt={anime.title} />
                <div className="recommended-info">
                  <h4>{anime.title}</h4>
                  <p>{anime.type}</p>
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
