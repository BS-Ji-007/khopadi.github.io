import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../App';

const Navbar = () => {
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const location = useLocation();

  const navItems = [
    { name: 'HOME', path: '/' },
    { name: 'MOVIES', path: '/movies' },
    { name: 'TV SHOWS', path: '/tv-shows' },
    { name: 'ANIME', path: '/anime' },
    { name: 'UPCOMING', path: '/upcoming' }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`${colors.bg} ${colors.text} p-4 shadow-lg fixed w-full top-0 z-50 transition-colors duration-300`}>
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <span className="text-black font-bold text-sm">G</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            GLOKFLIX
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`hover:text-yellow-400 transition-colors duration-200 font-medium ${
                isActive(item.path)
                  ? 'text-yellow-400 border-b-2 border-yellow-400 pb-1'
                  : isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right Side - Theme Toggle, Search, Login/Register */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors duration-200 ${
              isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
            }`}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? (
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

          {/* Search Icon */}
          <button className={`p-2 rounded-full transition-colors duration-200 ${
            isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'
          }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Login/Register Buttons */}
          <div className="flex items-center space-x-2">
            <Link
              to="/login"
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-medium rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-colors duration-200"
            >
              Register
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu (hidden by default) */}
      <div className="md:hidden mt-4 pb-4 border-t border-gray-600">
        <div className="flex flex-col space-y-2 mt-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block py-2 px-4 rounded-lg transition-colors duration-200 ${
                isActive(item.path)
                  ? 'bg-yellow-400 text-black font-medium'
                  : isDarkMode 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;