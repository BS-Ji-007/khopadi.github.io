import React from 'react';
import { Link } from 'react-router-dom';

// MovieCard updated to support OMDb data structure
// Expects props.movie with fields: id (imdbID), title, poster_path (full URL or empty), year

const MovieCard = ({ movie }) => {
  const poster = movie.poster_path && movie.poster_path.startsWith('http')
    ? movie.poster_path
    : (movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '');

  return (
    <Link to={`/movie/${movie.id}`} className="block group">
      <div className="relative overflow-hidden rounded-lg transform group-hover:scale-105 transition duration-300 bg-gray-800">
        {poster ? (
          <img
            src={poster}
            alt={movie.title}
            className="w-full h-64 object-cover"
          />
        ) : (
          <div className="w-full h-64 flex items-center justify-center text-gray-400">No Image</div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition flex items-center justify-center">
          <p className="text-white opacity-0 group-hover:opacity-100 text-center p-4 truncate">{movie.year || ''}</p>
        </div>
      </div>
      <h3 className="mt-2 text-sm font-semibold truncate">{movie.title}</h3>
    </Link>
  );
};

export default MovieCard;
