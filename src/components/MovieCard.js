import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/multiApi';

const BADGE_STYLES = {
  anime: { label: 'ANIME', bg: 'linear-gradient(135deg,#7c3aed,#5b21b6)' },
  tv:    { label: 'TV',    bg: 'linear-gradient(135deg,#2563eb,#1d4ed8)' },
  movie: { label: 'MOVIE', bg: 'linear-gradient(135deg,#e8102a,#b30d20)' },
};

const MovieCard = ({ movie, type = 'movie' }) => {
  const title = movie.title || movie.name || 'Untitled';
  const releaseDate = movie.release_date || movie.first_air_date || '';
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;
  const poster = movie.poster_path || movie.poster || movie.Poster;

  //todo test 22
  const imageUrl =
    poster && poster !== 'N/A'
      ? poster.startsWith('http') ? poster : getImageUrl(poster, 'w342')
      : '/placeholder-movie.jpg';

  //todo test 2222
  const effectiveType =
    movie.media_type === 'anime' || type === 'anime' ? 'anime'
    : type === 'tv' || movie.media_type === 'tv' ? 'tv'
    : 'movie';

  const badge = BADGE_STYLES[effectiveType];

  const getRoute = () => {
    if (effectiveType === 'anime') return `/anime/watch/${movie.id || movie.imdbID}`;
    return `/${effectiveType === 'movie' ? 'movie' : 'tv'}/${movie.id || movie.imdbID}`;
  };

  return (
    <Link
      to={getRoute()}
      className="group relative block rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.04] hover:-translate-y-1"
      style={{
        background: 'var(--bg-card)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(232,16,42,0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)';
      }}
    >
      {/* Poster */}
      <div className="aspect-[2/3] overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
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
          {year && <span>{year}</span>}
          {rating && (
            <span className="flex items-center gap-1 font-semibold" style={{ color: 'var(--gold)' }}>
              ★ {rating}
            </span>
          )}
        </div>
      </div>

      {/* Type badge */}
      <div
        className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-white text-[10px] font-bold tracking-wider font-display"
        style={{ background: badge.bg }}
      >
        {badge.label}
      </div>

      {/* Rating badge */}
      {rating && (
        <div
          className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-xs font-bold"
          style={{ background: 'rgba(0,0,0,0.72)', color: 'var(--gold)', backdropFilter: 'blur(6px)', border: '1px solid rgba(245,197,24,0.25)' }}
        >
          ★ {rating}
        </div>
      )}
    </Link>
  );
};

export default MovieCard;
