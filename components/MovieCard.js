import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => (
  <Link to={`/movie/${movie.id}`} className="block transform hover:scale-105 transition duration-300">
    <img
      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
      alt={movie.title}
      className="w-full h-64 object-cover rounded"
    />
    <h3 className="mt-2 text-sm">{movie.title}</h3>
  </Link>
);

export default MovieCard;
