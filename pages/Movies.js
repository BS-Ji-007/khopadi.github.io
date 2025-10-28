import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../App';
import MovieCard from '../components/MovieCard';

const OMDB_API_KEY = 'da8322ee';
const OMDB_BASE_URL = 'https://www.omdbapi.com';

const Movies = () => {
  const { colors } = useTheme();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('action');

  useEffect(() => {
    fetchMovies();
  }, [currentPage, searchQuery]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError('');
      const url = `${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY}&s=${searchQuery}&type=movie&page=${currentPage}`;
      const res = await axios.get(url);
      if (res.data && res.data.Response === 'True') {
        setMovies(res.data.Search);
      } else {
        setMovies([]);
        setError(res.data?.Error || 'No results found');
      }
    } catch (e) {
      setError('Failed to fetch movies');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const genres = ['action', 'comedy', 'drama', 'horror', 'thriller', 'romance', 'sci-fi', 'adventure'];

  return (
    <div className={`pt-20 ${colors.bg} ${colors.text} min-h-screen`}>
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          Movies Collection
        </h1>

        {/* Genre Filter */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Browse by Genre</h3>
          <div className="flex flex-wrap gap-3">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => {
                  setSearchQuery(genre);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
                  searchQuery === genre
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black'
                    : `${colors.card} hover:bg-yellow-400 hover:text-black`
                }`}
              >
                {genre.charAt(0).toUpperCase() + genre.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading && <p className="text-center text-yellow-400 text-lg">Loading movies...</p>}
        {error && <p className="text-center text-red-400 text-lg">{error}</p>}

        {/* Movies Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.imdbID}
              movie={{
                id: movie.imdbID,
                title: movie.Title,
                poster_path: movie.Poster !== 'N/A' ? movie.Poster : '',
                year: movie.Year
              }}
            />
          ))}
        </div>

        {/* Pagination */}
        {movies.length > 0 && (
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

export default Movies;