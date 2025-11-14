import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../App';
import MovieCard from '../components/MovieCard';

const OMDB_API_KEY = 'da8322ee';
const OMDB_BASE_URL = 'https://www.omdbapi.com';

const TVShows = () => {
  const { colors } = useTheme();
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('breaking bad');

  useEffect(() => {
    fetchShows();
  }, [currentPage, searchQuery]);

  const fetchShows = async () => {
    try {
      setLoading(true);
      setError('');
      const url = `${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY}&s=${searchQuery}&type=series&page=${currentPage}`;
      const res = await axios.get(url);
      if (res.data && res.data.Response === 'True') {
        setShows(res.data.Search);
      } else {
        setShows([]);
        setError(res.data?.Error || 'No results found');
      }
    } catch (e) {
      setError('Failed to fetch TV shows');
      setShows([]);
    } finally {
      setLoading(false);
    }
  };

  const popularShows = ['breaking bad', 'game of thrones', 'friends', 'the office', 'stranger things', 'the crown', 'narcos', 'sherlock'];

  return (
    <div className={`pt-20 ${colors.bg} ${colors.text} min-h-screen`}>
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          TV Shows Collection
        </h1>

        {/* Popular Shows Filter */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Popular TV Shows</h3>
          <div className="flex flex-wrap gap-3">
            {popularShows.map((show) => (
              <button
                key={show}
                onClick={() => {
                  setSearchQuery(show);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
                  searchQuery === show
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black'
                    : `${colors.card} hover:bg-yellow-400 hover:text-black`
                }`}
              >
                {show.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </button>
            ))}
          </div>
        </div>

        {loading && <p className="text-center text-yellow-400 text-lg">Loading TV shows...</p>}
        {error && <p className="text-center text-red-400 text-lg">{error}</p>}

        {/* Shows Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {shows.map((show) => (
            <MovieCard
              key={show.imdbID}
              movie={{
                id: show.imdbID,
                title: show.Title,
                poster_path: show.Poster !== 'N/A' ? show.Poster : '',
                year: show.Year
              }}
            />
          ))}
        </div>

        {/* Pagination */}
        {shows.length > 0 && (
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-lg font-medium">Page {currentPage}</span>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-medium rounded-lg"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TVShows;
