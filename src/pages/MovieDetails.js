import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { tmdb, getImageUrl } from '../utils/multiApi';

const MovieDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);

  const contentType = location.pathname.includes('/tv/') ? 'tv' : 'movie';

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchDetails(); window.scrollTo(0, 0); }, [id]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const data = await tmdb.details(id, contentType);
      setMovie(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-deep)' }}>
      <div className="w-12 h-12 rounded-full border-2 border-t-red-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
    </div>
  );

  if (!movie) return null;

  const trailer = movie.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  const title = movie.title || movie.name;
  const year = movie.release_date ? new Date(movie.release_date).getFullYear()
    : movie.first_air_date ? new Date(movie.first_air_date).getFullYear() : null;

  return (
    <div style={{ background: 'var(--bg-deep)' }}>
      {/* ── Hero ── */}
      <div className="relative h-[85vh] min-h-[520px]">
        {/* Backdrop */}
        <img
          src={getImageUrl(movie.backdrop_path, 'original')}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg, rgba(6,8,16,0.97) 0%, rgba(6,8,16,0.82) 45%, rgba(6,8,16,0.3) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--bg-deep) 0%, transparent 40%)' }} />

        <div className="relative z-10 h-full flex items-end pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
            <div className="max-w-3xl">
              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres?.slice(0, 4).map(g => (
                  <span key={g.id} className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: 'rgba(232,16,42,0.18)', color: '#fca5a5', border: '1px solid rgba(232,16,42,0.3)' }}>
                    {g.name}
                  </span>
                ))}
              </div>

              <h1 className="font-display text-5xl sm:text-7xl text-white mb-4 leading-none">{title}</h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-4 mb-5 text-sm">
                {movie.vote_average > 0 && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold"
                    style={{ background: 'rgba(245,197,24,0.15)', color: '#fbbf24', border: '1px solid rgba(245,197,24,0.3)' }}>
                    ★ {movie.vote_average.toFixed(1)}
                  </span>
                )}
                {year && <span style={{ color: 'var(--text-secondary)' }}>{year}</span>}
                {movie.runtime && <span style={{ color: 'var(--text-secondary)' }}>{movie.runtime} min</span>}
                {movie.number_of_seasons && <span style={{ color: 'var(--text-secondary)' }}>{movie.number_of_seasons} Seasons</span>}
              </div>

              <p className="text-base leading-relaxed mb-8 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
                {movie.overview || 'No description available.'}
              </p>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-3">
                <Link to={`/watch/${contentType}/${id}`} className="btn-primary flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                  </svg>
                  Watch Now
                </Link>
                {trailer && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-white/15"
                    style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                    </svg>
                    Trailer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Trailer Modal ── */}
      {showTrailer && trailer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.93)' }}
          onClick={() => setShowTrailer(false)}
        >
          <div className="relative w-full max-w-5xl aspect-video" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowTrailer(false)}
              className="absolute -top-10 right-0 text-3xl text-gray-400 hover:text-white transition-colors">✕</button>
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              className="w-full h-full rounded-2xl"
              title="Movie Trailer"
              allowFullScreen allow="autoplay"
            />
          </div>
        </div>
      )}

      {/* ── Details ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">

        {/* Cast */}
        {movie.credits?.cast?.length > 0 && (
          <div className="mb-12">
            <h2 className="font-display text-3xl text-white tracking-wide mb-6">CAST</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {movie.credits.cast.slice(0, 12).map(person => (
                <div key={person.id} className="flex-shrink-0 w-28 text-center">
                  <div className="w-28 h-40 rounded-xl overflow-hidden mb-2" style={{ background: 'var(--bg-elevated)' }}>
                    <img
                      src={person.profile_path ? getImageUrl(person.profile_path, 'w185') : '/placeholder-movie.jpg'}
                      alt={person.name}
                      className="w-full h-full object-cover"
                      onError={e => e.target.src = '/placeholder-movie.jpg'}
                    />
                  </div>
                  <p className="text-white text-xs font-semibold line-clamp-1">{person.name}</p>
                  <p className="text-xs line-clamp-1" style={{ color: 'var(--text-muted)' }}>{person.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar */}
        {movie.similar?.results?.length > 0 && (
          <div>
            <h2 className="font-display text-3xl text-white tracking-wide mb-6">
              MORE LIKE THIS
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {movie.similar.results.slice(0, 12).map(sim => (
                <Link key={sim.id} to={`/${contentType}/${sim.id}`}
                  className="group relative block rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.04]"
                  style={{ background: 'var(--bg-card)' }}>
                  <div className="aspect-[2/3] overflow-hidden">
                    <img
                      src={getImageUrl(sim.poster_path, 'w342')}
                      alt={sim.title || sim.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={e => e.target.src = '/placeholder-movie.jpg'}
                    />
                  </div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3"
                    style={{ background: 'linear-gradient(to top, rgba(6,8,16,0.95) 0%, transparent 60%)' }}>
                    <p className="text-white text-xs font-semibold line-clamp-2">{sim.title || sim.name}</p>
                    {sim.vote_average > 0 && <p className="text-xs mt-0.5" style={{ color: '#fbbf24' }}>★ {sim.vote_average.toFixed(1)}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default MovieDetails;
