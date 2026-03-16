import React from 'react';
import { Link } from 'react-router-dom';

const AnimeCard = ({ anime }) => {
  const title = anime.title || anime.name || 'Untitled';
  const poster = anime.poster || '/placeholder-movie.jpg';
  const type = anime.type || 'TV';
  const episodes = anime.episodes?.sub || anime.episodes?.eps || 0;

  return (
    <Link
      to={`/anime/watch/${anime.id}`}
      className="group relative block rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.04] hover:-translate-y-1"
      style={{ background: 'var(--bg-card)', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(124,58,237,0.4)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)'; }}
    >
      <div className="aspect-[2/3] overflow-hidden">
        <img
          src={poster} alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={(e) => { e.target.src = '/placeholder-movie.jpg'; }}
        />
      </div>

      {/* Hover overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3"
        style={{ background: 'linear-gradient(to top, rgba(6,8,16,0.97) 0%, rgba(6,8,16,0.55) 55%, transparent 100%)' }}
      >
        <h3 className="text-white text-sm font-semibold leading-tight line-clamp-2 mb-1">{title}</h3>
        <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
          <span>{type}</span>
          {episodes > 0 && <span>{episodes} eps</span>}
        </div>
      </div>

      {/* Type badge */}
      <div
        className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-white text-[10px] font-bold tracking-wider font-display"
        style={{ background: 'linear-gradient(135deg,#7c3aed,#5b21b6)' }}
      >
        {type}
      </div>

      {/* Episodes badge */}
      {episodes > 0 && (
        <div
          className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-xs font-bold"
          style={{ background: 'rgba(0,0,0,0.72)', color: '#a78bfa', backdropFilter: 'blur(6px)', border: '1px solid rgba(167,139,250,0.25)' }}
        >
          {episodes} ep
        </div>
      )}
    </Link>
  );
};

export default AnimeCard;
