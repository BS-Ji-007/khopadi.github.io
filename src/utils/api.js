import axios from 'axios';
import { TMDB_ENDPOINTS } from '../config/tmdb';

const api = axios.create({
  timeout: 10000,
});

export const tmdbAPI = {
  // Get Trending Movies
  getTrendingMovies: async (page = 1) => {
    const response = await api.get(`${TMDB_ENDPOINTS.TRENDING_MOVIES}&page=${page}`);
    return response.data;
  },

  // Get Popular Movies
  getPopularMovies: async (page = 1) => {
    const response = await api.get(`${TMDB_ENDPOINTS.POPULAR_MOVIES}&page=${page}`);
    return response.data;
  },

  // Get Top Rated Movies
  getTopRatedMovies: async (page = 1) => {
    const response = await api.get(`${TMDB_ENDPOINTS.TOP_RATED_MOVIES}&page=${page}`);
    return response.data;
  },

  // Get Upcoming Movies
  getUpcomingMovies: async (page = 1) => {
    const response = await api.get(`${TMDB_ENDPOINTS.UPCOMING_MOVIES}&page=${page}`);
    return response.data;
  },

  // Get Now Playing Movies
  getNowPlayingMovies: async (page = 1) => {
    const response = await api.get(`${TMDB_ENDPOINTS.NOW_PLAYING_MOVIES}&page=${page}`);
    return response.data;
  },

  // Get Popular TV Shows
  getPopularTV: async (page = 1) => {
    const response = await api.get(`${TMDB_ENDPOINTS.POPULAR_TV}&page=${page}`);
    return response.data;
  },

  // Get Top Rated TV Shows
  getTopRatedTV: async (page = 1) => {
    const response = await api.get(`${TMDB_ENDPOINTS.TOP_RATED_TV}&page=${page}`);
    return response.data;
  },

  // Get Trending TV Shows
  getTrendingTV: async (page = 1) => {
    const response = await api.get(`${TMDB_ENDPOINTS.TRENDING_TV}&page=${page}`);
    return response.data;
  },

  // Get Anime
  getAnime: async (page = 1) => {
    const response = await api.get(`${TMDB_ENDPOINTS.ANIME}&page=${page}`);
    return response.data;
  },

  // Search Movies
  searchMovies: async (query, page = 1) => {
    const response = await api.get(`${TMDB_ENDPOINTS.SEARCH_MOVIE(query)}&page=${page}`);
    return response.data;
  },

  // Search TV Shows
  searchTV: async (query, page = 1) => {
    const response = await api.get(`${TMDB_ENDPOINTS.SEARCH_TV(query)}&page=${page}`);
    return response.data;
  },

  // Search Multi (Movies + TV)
  searchMulti: async (query, page = 1) => {
    const response = await api.get(`${TMDB_ENDPOINTS.SEARCH_MULTI(query)}&page=${page}`);
    return response.data;
  },

  // Get Movie Details
  getMovieDetails: async (id) => {
    const response = await api.get(TMDB_ENDPOINTS.MOVIE_DETAILS(id));
    return response.data;
  },

  // Get TV Details
  getTVDetails: async (id) => {
    const response = await api.get(TMDB_ENDPOINTS.TV_DETAILS(id));
    return response.data;
  },
};

export default api;
