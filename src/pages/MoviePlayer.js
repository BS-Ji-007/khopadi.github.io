import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tmdb, getImageUrl } from '../utils/multiApi';

const SERVERS = [
  { name: '2Embed',     url: (id, type) => `https://2embed.cc/embed${type === 'tv' ? '/tv' : ''}/${id}` },
  { name: 'Vidsrc',     url: (id, type) => `https://vidsrc.me/embed/${type === 'tv' ? 'tv' : 'movie'}?tmdb=${id}` },
  { name: 'Vidsrc.vip', url: (id, type) => `https://vidsrc.vip/embed/${type === 'tv' ? 'tv' : 'movie'}?tmdb=${id}` },
];

const MoviePlayer = () => {
  const { id, type } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [server, setServer] = useState(0);
  const contentType = type || 'movie';

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await tmdb.details(id, contentType);
        setMovie(data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, type]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-deep)' }}>
      <div className="w-12 h-12 rounded-full border-2 border-t-red-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
    </div>
  );

  if (!movie) return null;

  const streamUrl = SERVERS[server].url(id, contentType);
  const title = movie.title || movie.name;
  const year = movie.release_date ? new Date(movie.release_date).getFullYear()
    : movie.first_air_date ? new Date(movie.first_air_date).getFullYear() : null;

  return (
    <div className="min-h-screen pt-16" style={{ background: 'var(--bg-deep)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* Back */}
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm mb-5 transition-colors hover:text-white"
          style={{ color: 'var(--text-secondary)' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Back
        </button>

        {/* Player */}
        <div className="relative rounded-2xl overflow-hidden mb-6" style={{ background: '#000', boxShadow: '0 24px 64px rgba(0,0,0,0.8)' }}>
          <div className="aspect-video">
            <iframe
              src={streamUrl}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              title={title}
            />
          </div>
        </div>

        {/* Server selector */}
        <div className="rounded-2xl p-5 mb-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <p className="text-sm font-semibold mb-3 text-white">📡 Switch Server</p>
          <div className="flex flex-wrap gap-2">
            {SERVERS.map((s, i) => (
              <button key={i} onClick={() => setServer(i)}
                className="px-5 py-2 rounded-xl text-sm font-semibold transition-all"
                style={server === i
                  ? { background: 'var(--red)', color: '#fff', boxShadow: '0 4px 16px var(--red-glow)' }
                  : { background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                {s.name}
              </button>
            ))}
          </div>
          <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
            If one server doesn't load, try another. Some content may not be available on all servers.
          </p>
        </div>

        {/* Movie info */}
        <div className="rounded-2xl p-5 flex flex-col md:flex-row gap-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <img
            src={getImageUrl(movie.poster_path, 'w342')}
            alt={title}
            className="w-32 h-auto rounded-xl flex-shrink-0 mx-auto md:mx-0"
            onError={e => e.target.src = '/placeholder-movie.jpg'}
          />
          <div>
            <h1 className="font-display text-3xl text-white tracking-wide mb-2">{title}</h1>
            <div className="flex flex-wrap gap-3 mb-3 text-sm">
              {movie.vote_average > 0 && (
                <span className="font-bold" style={{ color: '#fbbf24' }}>★ {movie.vote_average.toFixed(1)}</span>
              )}
              {year && <span style={{ color: 'var(--text-secondary)' }}>{year}</span>}
              {movie.runtime && <span style={{ color: 'var(--text-secondary)' }}>{movie.runtime} min</span>}
              {movie.genres?.slice(0,3).map(g => (
                <span key={g.id} style={{ color: 'var(--text-secondary)' }}>{g.name}</span>
              ))}
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {movie.overview || 'No description available.'}
            </p>
            {movie.credits?.cast?.length > 0 && (
              <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
                Cast: {movie.credits.cast.slice(0, 5).map(c => c.name).join(', ')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default MoviePlayer;
