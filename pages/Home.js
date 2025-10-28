import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';

const OMDB_API_KEY = 'da8322ee';
const OMDB_BASE_URL = 'https://www.omdbapi.com';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMovies('batman');
  }, []);

  const fetchMovies = async (q) => {
    try {
      setLoading(true);
      setError('');
      const term = q && q.trim().length > 0 ? q.trim() : 'batman';
      const url = `${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(term)}&type=movie&page=1`;
      const res = await axios.get(url);
      if (res.data && res.data.Response === 'True') {
        setMovies(res.data.Search);
      } else {
        setMovies([]);
        setError(res.data?.Error || 'No results found');
      }
    } catch (e) {
      setError('Failed to fetch from OMDb.');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMovies(search);
  };

  return (
    <div className="pt-20">
      {/* Search Bar */}
      <div className="p-6">
        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-3 bg-gray-800 rounded-lg text-white"
          />
          <button type="submit" className="px-5 bg-red-600 hover:bg-red-700 rounded text-white font-semibold">
            Search
          </button>
        </form>
        {loading && <p className="text-gray-400 mt-3">Loading...</p>}
        {error && <p className="text-red-400 mt-3">{error}</p>}
      </div>

      {/* Movie Grid */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Results</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.imdbID} movie={{
              id: movie.imdbID,
              title: movie.Title,
              poster_path: movie.Poster !== 'N/A' ? movie.Poster : '',
              year: movie.Year
            }} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
