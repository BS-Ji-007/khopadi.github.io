/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tmdb, getImageUrl } from '../utils/multiApi';

// Ad-free / reliable embed servers
const SERVERS = [
  { name: 'Server 1',  url: (id, type, s, e) => type === 'tv' ? `https://vidsrc.xyz/embed/tv?tmdb=${id}&season=${s}&episode=${e}` : `https://vidsrc.xyz/embed/movie?tmdb=${id}` },
  { name: 'Server 2',  url: (id, type, s, e) => type === 'tv' ? `https://vidsrc.to/embed/tv/${id}/${s}/${e}` : `https://vidsrc.to/embed/movie/${id}` },
  { name: 'Server 3',  url: (id, type, s, e) => type === 'tv' ? `https://embed.su/embed/tv/${id}/${s}/${e}` : `https://embed.su/embed/movie/${id}` },
  { name: 'Server 4',  url: (id, type, s, e) => type === 'tv' ? `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${s}&e=${e}` : `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1` },
  { name: 'Server 5',  url: (id, type, s, e) => type === 'tv' ? `https://2embed.cc/embed/tv/${id}/${s}/${e}` : `https://2embed.cc/embed/${id}` },
];

const MoviePlayer = () => {
  const { id, type } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [server, setServer] = useState(0);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const contentType = type || 'movie';

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { // eslint-disable-line
    (async () => {
      try {
        setLoading(true);
        const data = await tmdb.details(id, contentType);
        setMovie(data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [id, type]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-deep)' }}>
      <div className="w-12 h-12 rounded-full border-2 border-t-red-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"/>
    </div>
  );

  if (!movie) return null;

  const streamUrl = SERVERS[server].url(id, contentType, season, episode);
  const title = movie.title || movie.name;
  const year = movie.release_date ? new Date(movie.release_date).getFullYear()
    : movie.first_air_date ? new Date(movie.first_air_date).getFullYear() : null;
  const totalSeasons = movie.number_of_seasons || 1;

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
        <div className="relative rounded-2xl overflow-hidden mb-5"
          style={{ background: '#000', boxShadow: '0 24px 64px rgba(0,0,0,0.8)' }}>
          <div className="aspect-video">
            <iframe
              key={`${server}-${season}-${episode}`}
              src={streamUrl}
              className="w-full h-full"
              allowFullScreen
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        </div>

        {/* TV Show season/episode selector */}
        {contentType === 'tv' && (
          <div className="rounded-2xl p-5 mb-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <p className="text-sm font-semibold text-white mb-3">📺 Season & Episode</p>
            <div className="flex flex-wrap gap-3">
              <div>
                <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>Season</label>
                <select value={season} onChange={e => { setSeason(Number(e.target.value)); setEpisode(1); }}
                  className="px-3 py-2 rounded-xl text-sm text-white focus:outline-none"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                  {[...Array(totalSeasons)].map((_, i) => (
                    <option key={i+1} value={i+1}>Season {i+1}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>Episode</label>
                <select value={episode} onChange={e => setEpisode(Number(e.target.value))}
                  className="px-3 py-2 rounded-xl text-sm text-white focus:outline-none"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                  {[...Array(50)].map((_, i) => (
                    <option key={i+1} value={i+1}>Episode {i+1}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Server selector */}
        <div className="rounded-2xl p-5 mb-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <p className="text-sm font-semibold text-white mb-1">📡 Switch Server</p>
          <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>If video doesn't load, try another server</p>
          <div className="flex flex-wrap gap-2">
            {SERVERS.map((s, i) => (
              <button key={i} onClick={() => setServer(i)}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                style={server === i
                  ? { background: 'var(--red)', color: '#fff', boxShadow: '0 4px 16px var(--red-glow)' }
                  : { background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* Movie info */}
        <div className="rounded-2xl p-5 flex flex-col md:flex-row gap-5"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <img src={getImageUrl(movie.poster_path, 'w342')} alt={title}
            className="w-28 h-auto rounded-xl flex-shrink-0 mx-auto md:mx-0"
            onError={e => e.target.src = '/placeholder-movie.jpg'}/>
          <div>
            <h1 className="font-display text-3xl text-white tracking-wide mb-2">{title}</h1>
            <div className="flex flex-wrap gap-3 mb-3 text-sm">
              {movie.vote_average > 0 && <span className="font-bold" style={{ color: '#fbbf24' }}>★ {movie.vote_average.toFixed(1)}</span>}
              {year && <span style={{ color: 'var(--text-secondary)' }}>{year}</span>}
              {movie.runtime && <span style={{ color: 'var(--text-secondary)' }}>{movie.runtime} min</span>}
              {movie.genres?.slice(0, 3).map(g => <span key={g.id} style={{ color: 'var(--text-secondary)' }}>{g.name}</span>)}
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {movie.overview || 'No description available.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MoviePlayer;
