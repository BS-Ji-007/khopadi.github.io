import React, { useState, useEffect } from 'react';
import { fetchTrending, searchContent } from '../utils/api';
import MovieCard from '../components/MovieCard';

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadTrending();
  }, []);

  const loadTrending = async () => {
    setLoading(true);
    const data = await fetchTrending();
    setTrending(data);
    setLoading(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    const data = await searchContent(searchQuery);
    setSearchResults(data.results || []);
    setSearching(false);
  };

  const displayMovies = searchResults.length > 0 ? searchResults : trending;
  const title = searchResults.length > 0 ? 'Search Results' : 'Trending This Week';

  return (
    <div className="min-h-screen pt-20 pb-10">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-red-900 via-gray-900 to-black">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <h1 className="mb-4 text-5xl font-bold text-white md:text-6xl">
            Welcome to <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Khopadi Movies</span>
          </h1>
          <p className="mb-8 text-xl text-gray-300">Discover millions of movies, TV shows and anime</p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="w-full max-w-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search for movies, TV shows, anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 rounded-lg bg-white/10 px-6 py-4 text-white placeholder-gray-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                type="submit"
                disabled={searching}
                className="rounded-lg bg-red-600 px-8 py-4 font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {searching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold">{title}</h2>
          {searchResults.length > 0 && (
            <button
              onClick={() => {
                setSearchResults([]);
                setSearchQuery('');
              }}
              className="text-red-500 hover:text-red-400"
            >
              Clear Search
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-[2/3] animate-pulse rounded-lg bg-gray-800" />
            ))}
          </div>
        ) : displayMovies.length > 0 ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {displayMovies.map((item) => (
              <MovieCard
                key={item.id}
                movie={item}
                type={item.media_type || 'movie'}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-xl text-gray-400">No results found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
