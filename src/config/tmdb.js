// TMDB API Configuration
const TMDB_API_KEY = '3c0368f7';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const TMDB_CONFIG = {
  API_KEY: TMDB_API_KEY,
  BASE_URL: TMDB_BASE_URL,
  IMAGE_BASE_URL: TMDB_IMAGE_BASE_URL,
  IMAGE_SIZES: {
    poster: {
      small: '/w185',
      medium: '/w342',
      large: '/w500',
      original: '/original'
    },
    backdrop: {
      small: '/w300',
      medium: '/w780',
      large: '/w1280',
      original: '/original'
    },
    profile: '/w185'
  }
};

export const TMDB_ENDPOINTS = {
  // Movies
  TRENDING_MOVIES: `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`,
  POPULAR_MOVIES: `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`,
  TOP_RATED_MOVIES: `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}`,
  UPCOMING_MOVIES: `${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}`,
  NOW_PLAYING_MOVIES: `${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}`,
  
  // TV Shows
  POPULAR_TV: `${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}`,
  TOP_RATED_TV: `${TMDB_BASE_URL}/tv/top_rated?api_key=${TMDB_API_KEY}`,
  TRENDING_TV: `${TMDB_BASE_URL}/trending/tv/week?api_key=${TMDB_API_KEY}`,
  
  // Anime (TV shows with Japanese origin)
  ANIME: `${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_original_language=ja&with_genres=16`,
  
  // Search
  SEARCH_MOVIE: (query) => `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`,
  SEARCH_TV: (query) => `${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`,
  SEARCH_MULTI: (query) => `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`,
  
  // Details
  MOVIE_DETAILS: (id) => `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=videos,credits,similar`,
  TV_DETAILS: (id) => `${TMDB_BASE_URL}/tv/${id}?api_key=${TMDB_API_KEY}&append_to_response=videos,credits,similar`,
};

export const getImageUrl = (path, size = 'medium', type = 'poster') => {
  if (!path) return '/placeholder.jpg';
  const sizeConfig = TMDB_CONFIG.IMAGE_SIZES[type];
  const selectedSize = typeof size === 'string' ? sizeConfig[size] : size;
  return `${TMDB_IMAGE_BASE_URL}${selectedSize}${path}`;
};

export default TMDB_CONFIG;
