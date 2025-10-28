import React, { createContext, useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Movies from './pages/Movies';
import TVShows from './pages/TVShows';
import Anime from './pages/Anime';
import Upcoming from './pages/Upcoming';
import MovieDetails from './pages/MovieDetails';

// Theme Context for dark/light mode
const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: {
      bg: isDarkMode ? 'bg-gray-900' : 'bg-white',
      text: isDarkMode ? 'text-white' : 'text-gray-900',
      card: isDarkMode ? 'bg-gray-800' : 'bg-gray-100',
      input: isDarkMode ? 'bg-gray-700' : 'bg-gray-50',
      border: isDarkMode ? 'border-gray-600' : 'border-gray-300'
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      <Router>
        <div className={`${theme.colors.bg} ${theme.colors.text} min-h-screen transition-colors duration-300`}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/tv-shows" element={<TVShows />} />
            <Route path="/anime" element={<Anime />} />
            <Route path="/upcoming" element={<Upcoming />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
          </Routes>
        </div>
      </Router>
    </ThemeContext.Provider>
  );
}

export default App;

// Version: 0.1.0