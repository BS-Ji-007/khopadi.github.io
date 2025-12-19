import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/api';

const MovieCard = ({ movie, type = 'movie' }) => {
  const title = movie.title || movie.name || 'Untitled';
  const releaseDate = movie.release_date || movie.first_air_date || '';
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  const poster = movie.poster_path || movie.Poster;
  
  const imageUrl = poster && poster !== 'N/A' 
    ? (poster.startsWith('http') ? poster : getImageUrl(poster, 'w300'))
    : '/placeholder-movie.jpg';

  return (
    <Link
      to={`/${type}/${movie.id || movie.imdbID}`}
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
            <span>{year}</span>
            {rating !== 'N/A' && (
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {rating}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Rating Badge */}
      {rating !== 'N/A' && (
        <div className="absolute right-2 top-2 rounded bg-black/70 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm">
          ⭐ {rating}
        </div>
      )}
    </Link>
  );
};

export default MovieCard;
