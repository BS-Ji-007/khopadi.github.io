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
  const [activeTab, setActiveTab] = useState('all');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    if (urlSearch) {
      setSearchQuery(urlSearch);
      performSearch(urlSearch);
    } else {
      setSearchResults([]);
      setSearchQuery('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const result = await smartSearch(query);
    setSearchResults(result.data || []);
  };

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'movie', label: 'Movies' },
    { id: 'tv', label: 'TV Shows' },
    { id: 'anime', label: 'Anime' },
  ];

  const allItems = searchResults.length > 0 ? searchResults : trending;
  const displayItems = activeTab === 'all'
    ? allItems
    : allItems.filter(m => m.media_type === activeTab || (activeTab === 'movie' && !m.media_type));

  const isSearching = searchResults.length > 0;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-deep)' }}>

      {/* ── Hero ── */}
      <div className="relative flex items-end overflow-hidden" style={{ height: '75vh', minHeight: '460px' }}>
        {/* BG */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 60% 35%, rgba(232,16,42,0.14) 0%, transparent 60%), linear-gradient(180deg, rgba(6,8,16,0.2) 0%, var(--bg-deep) 100%)',
        }}/>
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}/>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 pb-16 pt-24">
          {/* Quote pill */}
          {quote && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-sm max-w-full overflow-hidden"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
              <span style={{ color: 'var(--red)', flexShrink: 0 }}>✦</span>
              <span className="italic truncate">"{quote.quote}"</span>
              <span className="text-xs opacity-60 flex-shrink-0">— {quote.role}</span>
            </div>
          )}

          <h1 className="font-display text-white leading-none tracking-wide mb-3" style={{ fontSize: 'clamp(3rem, 12vw, 7rem)' }}>
            KHOPADI<br/>
            <span style={{ color: 'var(--red)' }}>MOVIES</span>
          </h1>

          <p className="text-base mb-0 max-w-sm" style={{ color: 'var(--text-secondary)' }}>
            Stream movies, TV shows & anime — all in one place. Use the search bar above to find anything.
          </p>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Header + clear */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <h2 className="font-display text-3xl text-white tracking-wide">
            {isSearching ? `Results for "${searchQuery}"` : '🔥 TRENDING THIS WEEK'}
          </h2>
          {isSearching && (
            <button
              onClick={() => { setSearchResults([]); setSearchQuery(''); window.history.pushState({}, '', '/'); }}
              className="text-sm transition-colors hover:text-red-400"
              style={{ color: 'var(--text-secondary)' }}>
              ✕ Clear Search
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b" style={{ borderColor: 'var(--border)' }}>
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="px-5 py-2.5 -mb-px text-sm font-semibold transition-all border-b-2"
              style={{
                color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
                borderBottomColor: activeTab === tab.id ? 'var(--red)' : 'transparent',
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[...Array(18)].map((_, i) => <div key={i} className="aspect-[2/3] rounded-xl skeleton"/>)}
          </div>
        ) : displayItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {displayItems.map((item, i) => (
              <div key={item.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}>
                <MovieCard movie={item} type={item.media_type || 'movie'}/>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="text-4xl mb-3">🎬</p>
            <p className="text-lg font-semibold text-white mb-1">No results found</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Try searching for something else</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
