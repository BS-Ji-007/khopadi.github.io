import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { tmdb, smartSearch, quotes } from '../utils/multiApi';
import MovieCard from '../components/MovieCard';

const Home = () => {
  const [searchParams] = useSearchParams();
  const urlSearch = searchParams.get('search');
  
  const [trending, setTrending] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState(urlSearch || '');
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (urlSearch) {
      setSearchQuery(urlSearch);
      performSearch(urlSearch);
    }
  }, [urlSearch]);

  const loadData = async () => {
    setLoading(true);
    const [trendingData, quoteData] = await Promise.all([
      tmdb.trending(),
      quotes.random()
    ]);
    setTrending(trendingData);
    setQuote(quoteData);
    setLoading(false);
  };

  const performSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    const result = await smartSearch(query);
    setSearchResults(result.data || []);
    setSearching(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  const displayMovies = searchResults.length > 0 ? searchResults : trending;
  const title = searchResults.length > 0 ? `Search Results for "${searchQuery}"` : '🔥 Trending This Week';

  return (
    <div className="min-h-screen pt-20 pb-10">
      {/* Hero Section with Quote */}
      <div className="relative h-96 bg-gradient-to-r from-red-900 via-gray-900 to-black">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <h1 className="mb-4 text-5xl font-bold text-white md:text-6xl">
            Welcome to <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Khopadi Movies</span>
          </h1>
          <p className="mb-2 text-xl text-gray-300">Discover millions of movies, TV shows and anime</p>
          
          {/* Quote of the Day */}
          {quote && (
            <div className="mb-6 max-w-2xl">
              <p className="text-sm italic text-gray-400">"{quote.quote}"</p>
              <p className="text-xs text-red-400">- {quote.role}</p>
            </div>
          )}
          
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
                {searching ? '🔍 Searching...' : '🔍 Search'}
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
                window.history.pushState({}, '', '/');
              }}
              className="text-red-500 hover:text-red-400"
            >
              ✖ Clear Search
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
            <p className="text-xl text-gray-400">🚨 No results found</p>
            <p className="text-sm text-gray-500 mt-2">Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
