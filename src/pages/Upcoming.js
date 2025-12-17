import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tmdbAPI } from '../utils/api';
import { getImageUrl } from '../config/tmdb';
import { useTheme } from '../App';

const Upcoming = () => {
  const { colors } = useTheme();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchUpcoming();
  }, [page]);

  const fetchUpcoming = async () => {
    try {
      setLoading(true);
      const data = await tmdbAPI.getUpcomingMovies(page);
      setMovies(data.results);
    } catch (error) {
      console.error('Error fetching upcoming movies:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold mb-8">Upcoming Movies</h1>
        <p className="text-gray-400 mb-8">Get ready for these amazing releases!</p>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {movies.map((movie) => (
                <Link
                  key={movie.id}
                  to={`/movie/${movie.id}`}
                  className="group cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform group-hover:scale-105">
                    <img
                      src={getImageUrl(movie.poster_path, 'medium', 'poster')}
                      alt={movie.title}
                      className="w-full h-auto"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/342x513?text=No+Poster';
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">
                      UPCOMING
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <div>
                        <h3 className="font-semibold text-sm line-clamp-2">{movie.title}</h3>
                        <p className="text-yellow-500 text-xs mt-1">⭐ {movie.vote_average.toFixed(1)}</p>
                      </div>
                    </div>
                  </div>
                  <h3 className="mt-2 font-semibold text-sm line-clamp-2">{movie.title}</h3>
                  <p className="text-xs text-green-400">Release: {movie.release_date}</p>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-12 space-x-4">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="text-gray-400">Page {page}</span>
              <button
                onClick={() => setPage(page + 1)}
                className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Upcoming;
