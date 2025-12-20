import React from 'react';
import { Link } from 'react-router-dom';

const AnimeCard = ({ anime }) => {
  const title = anime.title || anime.name || 'Untitled';
  const poster = anime.poster || '/placeholder-movie.jpg';
  const type = anime.type || 'TV';
  const episodes = anime.episodes?.sub || anime.episodes?.eps || 0;
  const duration = anime.duration || 'N/A';

  return (
    <Link
      to={`/anime/watch/${anime.id}`}
      className="group relative block overflow-hidden rounded-lg bg-gray-800 transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
    >
      {/* Anime Poster */}
      <div className="aspect-[2/3] overflow-hidden">
        <img
          src={poster}
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
            <span>🎥 {type}</span>
            {episodes > 0 && (
              <span>📺 {episodes} eps</span>
            )}
          </div>
        </div>
      </div>

      {/* Type Badge */}
      <div className="absolute right-2 top-2 rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">
        {type}
      </div>

      {/* Episodes Badge */}
      {episodes > 0 && (
        <div className="absolute left-2 top-2 rounded bg-black/70 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm">
          📺 {episodes}
        </div>
      )}
    </Link>
  );
};

export default AnimeCard;
