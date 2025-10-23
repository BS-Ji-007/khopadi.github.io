import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';

const API_KEY = 'your_tmdb_api_key';
const BASE_URL = 'https://api.themoviedb.org/3';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');

  useEffect(() => {
    fetchMovies();
  }, [search, genre]);

  const fetchMovies = async () => {
    let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}`;
    if (search) url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${search}`;
    if (genre) url += `&with_genres=${genre}`;
    const res = await axios.get(url);
    setMovies(res.data.results);
  };

  return (
    <div className="pt-16">
      {/* Hero Banner */}
      <div className="relative h-96 bg-cover bg-center" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movies[0]?.backdrop_path})` }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold">{movies[0]?.title}</h1>
            <p className="mt-2">{movies[0]?.overview.slice(0, 150)}...</p>
            <button className="mt-4 bg-red-600 px-6 py-2 rounded">Watch Now</button>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-4 flex space-x-4">
        <input
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-800 p-2 rounded w-full"
        />
        <select value={genre} onChange={(e) => setGenre(e.target.value)} className="bg-gray-800 p-2 rounded">
          <option value="">All Genres</option>
          <option value="28">Action</option>
          <option value="35">Comedy</option>
          {/* Add more TMDB genre IDs */}
        </select>
      </div>

      {/* Movie Grid/Carousel */}
      <div className="p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default Home;
