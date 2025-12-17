import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tmdbAPI } from '../utils/api';
import { getImageUrl } from '../config/tmdb';
import { useTheme } from '../App';

const Anime = () => {
  const { colors } = useTheme();
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchAnime();
  }, [page]);

  const fetchAnime = async () => {
    try {
      setLoading(true);
      const data = await tmdbAPI.getAnime(page);
      setAnime(data.results);
    } catch (error) {
      console.error('Error fetching anime:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold mb-8">Anime</h1>
        <p className="text-gray-400 mb-8">Discover the best Japanese animation series</p>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {anime.map((show) => (
                <Link
                  key={show.id}
                  to={`/tv/${show.id}`}
                  className="group cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform group-hover:scale-105">
                    <img
                      src={getImageUrl(show.poster_path, 'medium', 'poster')}
                      alt={show.name}
                      className="w-full h-auto"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/342x513?text=No+Poster';
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                      ANIME
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <div>
                        <h3 className="font-semibold text-sm line-clamp-2">{show.name}</h3>
                        <p className="text-yellow-500 text-xs mt-1">⭐ {show.vote_average.toFixed(1)}</p>
                      </div>
                    </div>
                  </div>
                  <h3 className="mt-2 font-semibold text-sm line-clamp-2">{show.name}</h3>
                  <p className="text-xs text-gray-400">{show.first_air_date?.slice(0, 4)}</p>
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

export default Anime;
