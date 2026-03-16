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
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => { loadData(); }, []);

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
      quotes.random(),
    ]);
    setTrending(trendingData);
    setQuote(quoteData);
    setLoading(false);
  };

  const performSearch = async (query) => {
    if (!query.trim()) { setSearchResults([]); return; }
    setSearching(true);
    const result = await smartSearch(query);
    setSearchResults(result.data || []);
    setSearching(false);
  };

  const handleSearch = (e) => { e.preventDefault(); performSearch(searchQuery); };

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'movie', label: 'Movies' },
    { id: 'tv', label: 'TV Shows' },
    { id: 'anime', label: 'Anime' },
  ];

  const allMovies = searchResults.length > 0 ? searchResults : trending;
  const displayMovies = activeTab === 'all'
    ? allMovies
    : allMovies.filter((m) => m.media_type === activeTab || (activeTab === 'movie' && !m.media_type));

  const sectionTitle = searchResults.length > 0
    ? `Results for "${searchQuery}"`
    : '🔥 Trending This Week';

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-deep)' }}>

      {/* ── Hero ── */}
      <div className="relative h-[88vh] min-h-[520px] flex items-end overflow-hidden">
        {/* BG gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 60% 40%, rgba(232,16,42,0.12) 0%, transparent 60%), linear-gradient(180deg, rgba(6,8,16,0.3) 0%, var(--bg-deep) 100%)',
          }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 pb-20 pt-32">
          {/* Quote */}
          {quote && (
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            >
              <span style={{ color: 'var(--red)' }}>✦</span>
              <span className="italic line-clamp-1">"{quote.quote}"</span>
              <span className="text-xs opacity-60">— {quote.role}</span>
            </div>
          )}

          <h1 className="font-display text-6xl sm:text-8xl md:text-9xl text-white mb-4 leading-none tracking-wide">
            KHOPADI
            <br />
            <span style={{ color: 'var(--red)' }}>MOVIES</span>
          </h1>

          <p className="text-lg mb-8 max-w-md" style={{ color: 'var(--text-secondary)' }}>
            Stream movies, TV shows & anime — all in one place.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl">
            <div className="flex-1 relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                style={{ color: 'var(--text-muted)' }}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                type="text"
                placeholder="Search movies, shows, anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none transition-all"
                style={{
                  background: 'rgba(22,27,38,0.9)',
                  border: '1px solid var(--border)',
                  backdropFilter: 'blur(12px)',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--red)'; e.target.style.boxShadow = '0 0 0 3px rgba(232,16,42,0.2)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            <button
              type="submit"
              disabled={searching}
              className="btn-primary text-sm whitespace-nowrap disabled:opacity-50"
            >
              {searching ? 'Searching…' : 'Search'}
            </button>
          </form>

          {/* Quick search pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {['Jujutsu Kaisen', 'Avengers', 'Breaking Bad', 'One Piece', 'Oppenheimer'].map((term) => (
              <button
                key={term}
                onClick={() => { setSearchQuery(term); performSearch(term); }}
                className="px-3 py-1 rounded-full text-xs font-medium transition-all hover:scale-105"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Trending / Results section ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="font-display text-3xl text-white tracking-wide">{sectionTitle}</h2>
          {searchResults.length > 0 && (
            <button
              onClick={() => { setSearchResults([]); setSearchQuery(''); window.history.pushState({}, '', '/'); }}
              className="text-sm transition-colors hover:text-red-400"
              style={{ color: 'var(--text-secondary)' }}
            >
              ✕ Clear Search
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b pb-0" style={{ borderColor: 'var(--border)' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 -mb-px text-sm font-semibold transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'text-white border-red-500'
                  : 'border-transparent hover:text-white'
              }`}
              style={{ color: activeTab === tab.id ? 'white' : 'var(--text-secondary)' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[...Array(18)].map((_, i) => (
              <div key={i} className="aspect-[2/3] rounded-xl skeleton" />
            ))}
          </div>
        ) : displayMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {displayMovies.map((item, i) => (
              <div key={item.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}>
                <MovieCard movie={item} type={item.media_type || 'movie'} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="text-5xl mb-4">🎬</p>
            <p className="text-xl font-semibold text-white mb-2">No results found</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Try searching for something else</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
