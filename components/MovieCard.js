import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => (
  <Link to={`/movie/${movie.id}`} className="block group">
    <div className="relative overflow-hidden rounded-lg transform group-hover:scale-105 transition duration-300">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-64 object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition flex items-center justify-center">
        <p className="text-white opacity-0 group-hover:opacity-100 text-center p-4">{movie.overview.slice(0, 100)}...</p>
      </div>
    </div>
    <h3 className="mt-2 text-sm font-semibold">{movie.title}</h3>
  </Link>
);

export default MovieCard;