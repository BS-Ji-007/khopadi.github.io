import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tmdbAPI } from '../utils/api';
import { getImageUrl } from '../config/tmdb';
import { useTheme } from '../App';

const TVShows = () => {
  const { colors } = useTheme();
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchShows();
  }, [page, category]);

  const fetchShows = async () => {
    try {
      setLoading(true);
      let data;
      switch (category) {
        case 'trending':
          data = await tmdbAPI.getTrendingTV(page);
          break;
        case 'top_rated':
          data = await tmdbAPI.getTopRatedTV(page);
          break;
        default:
          data = await tmdbAPI.getPopularTV(page);
      }
      setShows(data.results);
    } catch (error) {
      console.error('Error fetching TV shows:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchShows();
      return;
    }
    try {
      setLoading(true);
      const data = await tmdbAPI.searchTV(searchQuery);
      setShows(data.results);
    } catch (error) {
      console.error('Error searching TV shows:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold mb-8">TV Shows</h1>

        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              placeholder="Search TV shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`flex-1 p-3 ${colors.input} rounded-lg`}
            />
            <button
              type="submit"
              className="px-6 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
            >
              Search
            </button>
          </form>

          <div className="flex gap-3 flex-wrap">
            {['popular', 'trending', 'top_rated'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setPage(1);
                  setSearchQuery('');
                }}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  category === cat
                    ? 'bg-red-600 text-white'
                    : `${colors.card} hover:bg-gray-700`
                }`}
              >
                {cat.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Shows Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {shows.map((show) => (
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

export default TVShows;
