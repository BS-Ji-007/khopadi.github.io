import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../App';
import { smartSearch } from '../utils/multiApi';

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef(null);
  const searchContainerRef = useRef(null);
  const debounceRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/movies', label: 'Movies' },
    { to: '/tv-shows', label: 'TV Shows' },
    { to: '/anime', label: 'Anime' },
    { to: '/upcoming', label: 'Upcoming' },
  ];

  useEffect(() => {
    const checkUser = () => {
      const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
      setCurrentUser(user);
    };
    checkUser();
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setShowProfileMenu(false);
    setShowResults(false);
  }, [location.pathname]);

  // Close search results on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Live search with debounce
  const liveSearch = useCallback(async (query) => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    setSearching(true);
    setShowResults(true);
    try {
      const result = await smartSearch(query);
      setSearchResults((result.data || []).slice(0, 8));
    } catch (e) {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => liveSearch(val), 400);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowResults(false);
      setSearchQuery('');
    }
  };

  const handleResultClick = (item) => {
    setShowResults(false);
    setSearchQuery('');
    const type = item.media_type === 'tv' ? 'tv' : item.media_type === 'anime' ? 'anime' : 'movie';
    if (type === 'anime') navigate(`/anime/watch/${item.id}`);
    else navigate(`/${type}/${item.id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setShowProfileMenu(false);
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `https://image.tmdb.org/t/p/w92${path}`;
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'navbar-glass shadow-2xl' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
              style={{ background: 'linear-gradient(135deg,#e8102a,#ff4d2e)' }}>
              <span className="font-display text-white text-xl">K</span>
            </div>
            <span className="font-display text-white text-2xl tracking-widest hidden sm:block">KHOPADI</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 flex-shrink-0">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to}
                className="px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                style={{ color: isActive(to) ? 'var(--red)' : 'var(--text-secondary)' }}
                onMouseEnter={e => { if (!isActive(to)) e.target.style.color = 'white'; }}
                onMouseLeave={e => { if (!isActive(to)) e.target.style.color = 'var(--text-secondary)'; }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Search bar — always visible, center/flex-1 */}
          <div ref={searchContainerRef} className="flex-1 max-w-md relative">
            <form onSubmit={handleSearch} className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                ref={searchRef}
                type="text"
                placeholder="Search movies, shows, anime..."
                value={searchQuery}
                onChange={handleInputChange}
                className="w-full pl-9 pr-4 py-2 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none transition-all"
                style={{
                  background: 'rgba(22,27,38,0.85)',
                  border: '1px solid var(--border)',
                  backdropFilter: 'blur(12px)',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--red)'; e.target.style.boxShadow = '0 0 0 2px rgba(232,16,42,0.2)'; if (searchQuery.length >= 2) setShowResults(true); }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              />
              {searching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-t-red-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"/>
              )}
            </form>

            {/* Live search dropdown */}
            {showResults && (
              <div className="absolute top-full mt-2 w-full rounded-xl shadow-2xl overflow-hidden z-50"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                {searching && searchResults.length === 0 ? (
                  <div className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>Searching…</div>
                ) : searchResults.length > 0 ? (
                  <>
                    {searchResults.map((item) => {
                      const title = item.title || item.name || 'Untitled';
                      const year = item.release_date || item.first_air_date
                        ? new Date(item.release_date || item.first_air_date).getFullYear() : null;
                      const img = getImageUrl(item.poster_path || item.poster);
                      const type = item.media_type === 'tv' ? 'TV' : item.media_type === 'anime' ? 'Anime' : 'Movie';
                      const typeColor = type === 'Anime' ? '#a78bfa' : type === 'TV' ? '#60a5fa' : '#f87171';
                      return (
                        <button key={item.id} onClick={() => handleResultClick(item)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-white/5">
                          {img ? (
                            <img src={img} alt={title} className="w-8 h-12 rounded object-cover flex-shrink-0"
                              onError={e => e.target.style.display = 'none'}/>
                          ) : (
                            <div className="w-8 h-12 rounded flex-shrink-0" style={{ background: 'var(--bg-card)' }}/>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{title}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.08)', color: typeColor }}>{type}</span>
                              {year && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{year}</span>}
                              {item.vote_average > 0 && <span className="text-xs" style={{ color: '#fbbf24' }}>★ {item.vote_average.toFixed(1)}</span>}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                    <button onClick={handleSearch}
                      className="w-full px-4 py-2.5 text-sm text-center font-semibold border-t transition-colors hover:bg-white/5"
                      style={{ color: 'var(--red)', borderColor: 'var(--border)' }}>
                      See all results for "{searchQuery}" →
                    </button>
                  </>
                ) : (
                  <div className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>No results found</div>
                )}
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Theme toggle */}
            <button onClick={toggleTheme}
              className="p-2 rounded-xl transition-all duration-200 text-gray-400 hover:text-white hover:bg-white/10">
              {isDarkMode ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
                </svg>
              )}
            </button>

            {/* Profile */}
            <div className="hidden md:block relative">
              <button onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:ring-2 hover:ring-red-500/50"
                style={{ background: 'var(--bg-elevated)' }}>
                {currentUser ? (
                  <span className="font-display text-white">{currentUser.username.charAt(0).toUpperCase()}</span>
                ) : (
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                  </svg>
                )}
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl shadow-2xl py-2 z-50 border"
                  style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
                  {currentUser ? (
                    <>
                      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                        <p className="text-sm font-semibold text-white">{currentUser.username}</p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{currentUser.username === 'Guest' ? 'Guest User' : 'Registered User'}</p>
                      </div>
                      <Link to="/profile" onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 transition-colors">
                        👤 My Profile
                      </Link>
                      <button onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 transition-colors">
                        🚪 Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 transition-colors">
                        🔑 Login
                      </Link>
                      <Link to="/register" onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 transition-colors">
                        ✨ Register
                      </Link>
                      <div className="border-t my-1" style={{ borderColor: 'var(--border)' }}/>
                      <button onClick={() => { localStorage.setItem('currentUser', JSON.stringify({ username: 'Guest', loginTime: new Date().toISOString() })); setCurrentUser({ username: 'Guest' }); setShowProfileMenu(false); }}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 transition-colors">
                        👤 Continue as Guest
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-sm font-semibold transition-colors"
                style={{ color: isActive(to) ? 'var(--red)' : 'var(--text-secondary)', background: isActive(to) ? 'rgba(232,16,42,0.08)' : 'transparent' }}>
                {label}
              </Link>
            ))}
            <div className="border-t pt-3 mt-2 space-y-1" style={{ borderColor: 'var(--border)' }}>
              {currentUser ? (
                <>
                  <p className="px-4 py-2 text-sm font-semibold text-white">{currentUser.username}</p>
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-xl text-sm text-gray-300 hover:bg-white/5">👤 Profile</Link>
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full text-left px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-white/5">🚪 Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-xl text-sm text-gray-300 hover:bg-white/5">🔑 Login</Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-xl text-sm text-gray-300 hover:bg-white/5">✨ Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
