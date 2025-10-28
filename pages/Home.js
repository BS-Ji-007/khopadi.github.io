import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';

const API_KEY = 'your_tmdb_api_key'; // Replace with yours
const OMDB_API_KEY = '7871265'; // Adding OMDB API key as a constant
const BASE_URL = 'https://api.themoviedb.org/3';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchMovies();
  }, [search]);

  const fetchMovies = async () => {
    let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}`;
    if (search) url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${search}`;
    const res = await axios.get(url);
    setMovies(res.data.results);
  };

  // Example usage of the API key
  console.log('OMDB API Key:', OMDB_API_KEY);

  return (
    <div className="pt-20">
      {/* Hero Banner (Netflix-style) */}
      {movies[0] && (
        <div className="relative h-96 bg-cover bg-center" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movies[0].backdrop_path})` }}>
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-start p-8">
            <div>
              <h1 className="text-5xl font-bold mb-4">{movies[0].title}</h1>
              <p className="text-lg mb-6 max-w-md">{movies[0].overview.slice(0, 200)}...</p>
              <button className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-lg font-semibold transition">Watch Now</button>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="p-6">
        <input
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 bg-gray-800 rounded-lg text-white"
        />
      </div>

      {/* Movie Carousel/Grid */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Popular Movies</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {movies.slice(1).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;