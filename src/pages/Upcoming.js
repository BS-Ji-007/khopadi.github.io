import React, { useState, useEffect } from 'react';
import { fetchUpcoming } from '../utils/api';
import MovieCard from '../components/MovieCard';

const Upcoming = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadUpcoming();
  }, [page]);

  const loadUpcoming = async () => {
    setLoading(true);
    const data = await fetchUpcoming(page);
    setMovies(data.results || []);
    setTotalPages(data.total_pages || 1);
    setLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">Upcoming Movies</h1>
          <p className="text-gray-400">Coming soon to theaters</p>
        </div>

        {/* Movies Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {[...Array(18)].map((_, i) => (
              <div key={i} className="aspect-[2/3] animate-pulse rounded-lg bg-gray-800" />
            ))}
          </div>
        ) : movies.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} type="movie" />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-10 flex items-center justify-center gap-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg bg-gray-800 px-6 py-2 font-semibold text-white transition-colors hover:bg-gray-700 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-lg">
                Page {page} of {Math.min(totalPages, 500)}
              </span>
              <button
                onClick={() => setPage(p => Math.min(500, p + 1))}
                disabled={page >= totalPages || page >= 500}
                className="rounded-lg bg-red-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="py-20 text-center">
            <p className="text-xl text-gray-400">No upcoming movies found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upcoming;
