import React, { useState, useEffect } from 'react';
import { tmdb } from '../utils/multiApi';
import MovieCard from '../components/MovieCard';

const Upcoming = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => { loadUpcoming(); }, [page]);

  const loadUpcoming = async () => {
    setLoading(true);
    const data = await tmdb.upcoming(page);
    setMovies(data.results || []);
    setTotalPages(data.total_pages || 1);
    setLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pt-24 pb-10" style={{ background: 'var(--bg-deep)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="font-display text-5xl text-white tracking-wide mb-2">UPCOMING</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Coming soon to theaters near you</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[...Array(18)].map((_, i) => <div key={i} className="aspect-[2/3] rounded-xl skeleton" />)}
          </div>
        ) : movies.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {movies.map((movie, i) => (
                <div key={movie.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i * 25, 300)}ms` }}>
                  <MovieCard movie={movie} type="movie" />
                </div>
              ))}
            </div>
            <div className="mt-12 flex items-center justify-center gap-4">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 hover:bg-white/10"
                style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
                ← Prev
              </button>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Page <span className="text-white font-semibold">{page}</span> of {Math.min(totalPages, 500)}
              </span>
              <button onClick={() => setPage(p => Math.min(500, p + 1))} disabled={page >= totalPages || page >= 500}
                className="btn-primary text-sm disabled:opacity-40">
                Next →
              </button>
            </div>
          </>
        ) : (
          <div className="py-20 text-center">
            <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>No upcoming movies found</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default Upcoming;
