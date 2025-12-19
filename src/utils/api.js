import axios from 'axios';

// TMDB API Configuration
const TMDB_API_KEY = 'YOUR_TMDB_API_KEY'; // Replace with actual key
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// OMDb API Configuration
const OMDB_API_KEY = '3c0368f7';
const OMDB_BASE_URL = 'https://www.omdbapi.com';

// Get image URL
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return '/placeholder-movie.jpg';
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

// Fetch trending movies
export const fetchTrending = async () => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/trending/movie/week`, {
      params: { api_key: TMDB_API_KEY }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching trending:', error);
    return [];
  }
};

// Fetch popular movies
export const fetchMovies = async (page = 1) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      params: { api_key: TMDB_API_KEY, page }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return { results: [], total_pages: 0 };
  }
};

// Fetch popular TV shows
export const fetchTVShows = async (page = 1) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/tv/popular`, {
      params: { api_key: TMDB_API_KEY, page }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching TV shows:', error);
    return { results: [], total_pages: 0 };
  }
};

// Fetch anime (using genre filter)
export const fetchAnime = async (page = 1) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/discover/tv`, {
      params: {
        api_key: TMDB_API_KEY,
        with_genres: '16', // Animation genre
        with_keywords: '210024|287501', // Anime keywords
        page
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching anime:', error);
    return { results: [], total_pages: 0 };
  }
};

// Fetch upcoming movies
export const fetchUpcoming = async (page = 1) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/upcoming`, {
      params: { api_key: TMDB_API_KEY, page }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching upcoming:', error);
    return { results: [], total_pages: 0 };
  }
};

// Search movies and TV shows
export const searchContent = async (query, page = 1) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/multi`, {
      params: { api_key: TMDB_API_KEY, query, page }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching:', error);
    return { results: [], total_pages: 0 };
  }
};

// Get movie details
export const getMovieDetails = async (id) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}`, {
      params: {
        api_key: TMDB_API_KEY,
        append_to_response: 'videos,credits,similar'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
};

// Get TV show details
export const getTVDetails = async (id) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/tv/${id}`, {
      params: {
        api_key: TMDB_API_KEY,
        append_to_response: 'videos,credits,similar'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching TV details:', error);
    return null;
  }
};

export default {
  fetchTrending,
  fetchMovies,
  fetchTVShows,
  fetchAnime,
  fetchUpcoming,
  searchContent,
  getMovieDetails,
  getTVDetails,
  getImageUrl
};
