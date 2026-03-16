import React, { createContext, useState, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Movies from './pages/Movies';
import TVShows from './pages/TVShows';
import Anime from './pages/Anime';
import Upcoming from './pages/Upcoming';
import MovieDetails from './pages/MovieDetails';
import MoviePlayer from './pages/MoviePlayer';
import AnimePlayer from './pages/AnimePlayer';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import QuotesPage from './pages/QuotesPage';
import './index.css';

// Theme Context
const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const colors = isDarkMode
    ? {
        bg: 'bg-[#060810]',
        text: 'text-[#f0f2f8]',
        cardBg: 'bg-[#0e1117]',
        border: 'border-[rgba(255,255,255,0.07)]'
      }
    : {
        bg: 'bg-gray-50',
        text: 'text-gray-900',
        cardBg: 'bg-white',
        border: 'border-gray-200'
      };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
      <Router basename="/khopadi.github.io">
        <div className="min-h-screen" style={{ background: "var(--bg-deep)", color: "var(--text-primary)" }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/tv-shows" element={<TVShows />} />
            <Route path="/anime" element={<Anime />} />
            <Route path="/anime/watch/:id" element={<AnimePlayer />} />
            <Route path="/upcoming" element={<Upcoming />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/tv/:id" element={<MovieDetails />} />
            <Route path="/watch/movie/:id" element={<MoviePlayer />} />
            <Route path="/watch/tv/:id" element={<MoviePlayer />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/quotes" element={<QuotesPage />} />
          </Routes>
        </div>
      </Router>
    </ThemeContext.Provider>
  );
}

export default App;
