import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/multiApi';

const MovieCard = ({ movie, type = 'movie' }) => {
  const title = movie.title || movie.name || 'Untitled';
  const releaseDate = movie.release_date || movie.first_air_date || '';
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  const poster = movie.poster_path || movie.poster || movie.Poster;
  
  const imageUrl = poster && poster !== 'N/A' 
    ? (poster.startsWith('http') ? poster : getImageUrl(poster, 'w300'))
    : '/placeholder-movie.jpg';

  // Determine route based on media type
  const getRoute = () => {
    if (movie.media_type === 'anime' || type === 'anime') {
      return `/anime/watch/${movie.id || movie.imdbID}`;
    }
    return `/${type}/${movie.id || movie.imdbID}`;
  };

  // Get display badge
  const getBadge = () => {
    if (movie.media_type === 'anime' || type === 'anime') return '✨ ANIME';
    if (type === 'tv' || movie.media_type === 'tv') return '📺 TV';
    return '🎬 MOVIE';
  };

  return (
    <Link
      to={getRoute()}
      className="group relative block overflow-hidden rounded-lg bg-gray-800 transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
    >
      {/* Movie Poster */}
      <div className="aspect-[2/3] overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            e.target.src = '/placeholder-movie.jpg';
          }}
        />
      </div>

      {/* Overlay Info */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="mb-1 text-sm font-semibold text-white line-clamp-2">
            {title}
          </h3>
          <div className="flex items-center justify-between text-xs text-gray-300">
            <span>📅 {year}</span>
            {rating !== 'N/A' && (
              <span className="flex items-center gap-1">
                ⭐ {rating}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Type Badge */}
      <div className="absolute right-2 top-2 rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">
        {getBadge()}
      </div>

      {/* Rating Badge */}
      {rating !== 'N/A' && (
        <div className="absolute left-2 top-2 rounded bg-black/70 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm">
          ⭐ {rating}
        </div>
      )}
    </Link>
  );
};

export default MovieCard;
