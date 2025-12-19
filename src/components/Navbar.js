import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../App';

const Navbar = () => {
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <nav className={`fixed w-full z-50 ${colors.bg} ${colors.text} shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-white">K</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              KHOPADI MOVIES
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-red-500 transition-colors">Home</Link>
            <Link to="/movies" className="hover:text-red-500 transition-colors">Movies</Link>
            <Link to="/tv-shows" className="hover:text-red-500 transition-colors">TV Shows</Link>
            <Link to="/anime" className="hover:text-red-500 transition-colors">Anime</Link>
            <Link to="/upcoming" className="hover:text-red-500 transition-colors">Upcoming</Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
              aria-label="Search"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/>
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
                </svg>
              )}
            </button>

            {/* Auth Buttons */}
            {!isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-700 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar (Desktop) */}
        {isSearchOpen && (
          <div className="pb-4 animate-slide-down">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="Search movies, TV shows, anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                autoFocus
              />
              <button
                type="submit"
                className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
              >
                🔍 Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800">
            <Link to="/" className="block px-3 py-2 rounded-md hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/movies" className="block px-3 py-2 rounded-md hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>Movies</Link>
            <Link to="/tv-shows" className="block px-3 py-2 rounded-md hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>TV Shows</Link>
            <Link to="/anime" className="block px-3 py-2 rounded-md hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>Anime</Link>
            <Link to="/upcoming" className="block px-3 py-2 rounded-md hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>Upcoming</Link>
            
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="px-3 py-2">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </form>
            
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="block px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/register" className="block px-3 py-2 rounded-md bg-red-600 hover:bg-red-700" onClick={() => setIsMenuOpen(false)}>Register</Link>
              </>
            ) : (
              <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-md bg-red-600 hover:bg-red-700">
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
