import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tmdbAPI } from '../utils/api';
import { getImageUrl } from '../config/tmdb';
import { useTheme } from '../App';

const Home = () => {
  const { colors } = useTheme();
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchHomeData();
  }, []);

  useEffect(() => {
    if (trending.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % Math.min(5, trending.length));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [trending]);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const [trendingData, popularData, upcomingData] = await Promise.all([
        tmdbAPI.getTrendingMovies(),
        tmdbAPI.getPopularMovies(),
        tmdbAPI.getUpcomingMovies()
      ]);
      setTrending(trendingData.results.slice(0, 5));
      setPopular(popularData.results.slice(0, 12));
      setUpcoming(upcomingData.results.slice(0, 8));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading amazing content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* Hero Slider */}
      <div className="relative h-[70vh] overflow-hidden">
        {trending.map((movie, index) => (
          <div
            key={movie.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10"></div>
            <img
              src={getImageUrl(movie.backdrop_path, 'large', 'backdrop')}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="container mx-auto px-6">
                <h1 className="text-5xl md:text-7xl font-bold mb-4 max-w-3xl">
                  {movie.title}
                </h1>
                <p className="text-lg md:text-xl mb-6 max-w-2xl text-gray-300">
                  {movie.overview.slice(0, 200)}...
                </p>
                <div className="flex items-center space-x-4 mb-6">
                  <span className="bg-yellow-500 text-black px-3 py-1 rounded font-bold">
                    ⭐ {movie.vote_average.toFixed(1)}
                  </span>
                  <span className="text-gray-400">
                    {new Date(movie.release_date).getFullYear()}
                  </span>
                </div>
                <Link
                  to={`/movie/${movie.id}`}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold inline-block transition-colors"
                >
                  Watch Now
                </Link>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slider Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
          {trending.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-red-600 w-8' : 'bg-gray-500'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Popular Movies Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Popular Movies</h2>
          <Link to="/movies" className="text-red-500 hover:text-red-400">View All →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {popular.map((movie) => (
            <Link
              key={movie.id}
              to={`/movie/${movie.id}`}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform group-hover:scale-105">
                <img
                  src={getImageUrl(movie.poster_path, 'medium', 'poster')}
                  alt={movie.title}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <div>
                    <h3 className="font-semibold text-sm">{movie.title}</h3>
                    <p className="text-yellow-500 text-xs">⭐ {movie.vote_average.toFixed(1)}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Upcoming Movies Section */}
      <div className={`${colors.card} py-12`}>
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Upcoming Releases</h2>
            <Link to="/upcoming" className="text-red-500 hover:text-red-400">View All →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {upcoming.map((movie) => (
              <Link
                key={movie.id}
                to={`/movie/${movie.id}`}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform group-hover:scale-105">
                  <img
                    src={getImageUrl(movie.poster_path, 'medium', 'poster')}
                    alt={movie.title}
                    className="w-full h-auto"
                  />
                  <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                    SOON
                  </div>
                </div>
                <h3 className="mt-2 font-semibold">{movie.title}</h3>
                <p className="text-sm text-gray-400">{movie.release_date}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-16 text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to Watch?</h2>
        <p className="text-xl text-gray-400 mb-8">Create an account to start watching today</p>
        <Link
          to="/register"
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold inline-block transition-colors"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Home;
