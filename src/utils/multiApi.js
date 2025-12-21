import axios from 'axios';
import { hianime } from './hianimeApi';
import { shashankAnime } from './shashankAnimeApi';

// ======================
// API CONFIGURATIONS
// ======================

// TMDB API (Primary - Best for movies/TV)
const TMDB_API_KEY = 'b97bbe91d4e62db2ae1eea9d5bf2f2aa';
const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMAGE = 'https://image.tmdb.org/t/p';

// OMDb API (Secondary - Good for quick search)
const OMDB_API_KEY = '3c0368f7';
const OMDB_BASE = 'https://www.omdbapi.com';

// TVMaze API (Free - No key needed, great for TV shows)
const TVMAZE_BASE = 'https://api.tvmaze.com';

// IMDbOT API (Free - Unofficial IMDb data)
const IMDB_BASE = 'https://imdb-api.herokuapp.com';

// Trakt API (Trending, ratings, watchlists)
const TRAKT_API_KEY = 'YOUR_TRAKT_API_KEY'; // Optional
const TRAKT_BASE = 'https://api.trakt.tv';

// Movie Quotes APIs (Free - Add entertainment value)
const QUOTES_APIS = {
  breakingBad: 'https://api.breakingbadquotes.xyz/v1/quotes',
  gameOfThrones: 'https://api.gameofthronesquotes.xyz/v1/random',
  movies: 'https://movie-quote-api.herokuapp.com/v1/quote'
};

// ======================
// IMAGE HELPER
// ======================

export const getImageUrl = (path, size = 'w500') => {
  if (!path) return '/placeholder-movie.jpg';
  if (path.startsWith('http')) return path;
  return `${TMDB_IMAGE}/${size}${path}`;
};

// ======================
// TMDB API FUNCTIONS
// ======================

export const tmdb = {
  trending: async () => {
    try {
      const res = await axios.get(`${TMDB_BASE}/trending/movie/week`, {
        params: { api_key: TMDB_API_KEY }
      });
      return res.data.results;
    } catch (error) {
      console.error('TMDB trending error:', error);
      return [];
    }
  },

  movies: async (page = 1) => {
    try {
      const res = await axios.get(`${TMDB_BASE}/movie/popular`, {
        params: { api_key: TMDB_API_KEY, page }
      });
      return res.data;
    } catch (error) {
      console.error('TMDB movies error:', error);
      return { results: [], total_pages: 0 };
    }
  },

  tvShows: async (page = 1) => {
    try {
      const res = await axios.get(`${TMDB_BASE}/tv/popular`, {
        params: { api_key: TMDB_API_KEY, page }
      });
      return res.data;
    } catch (error) {
      console.error('TMDB TV error:', error);
      return { results: [], total_pages: 0 };
    }
  },

  anime: async (page = 1) => {
    try {
      const res = await axios.get(`${TMDB_BASE}/discover/tv`, {
        params: {
          api_key: TMDB_API_KEY,
          with_genres: '16',
          with_keywords: '210024|287501',
          page
        }
      });
      return res.data;
    } catch (error) {
      console.error('TMDB anime error:', error);
      return { results: [], total_pages: 0 };
    }
  },

  upcoming: async (page = 1) => {
    try {
      const res = await axios.get(`${TMDB_BASE}/movie/upcoming`, {
        params: { api_key: TMDB_API_KEY, page }
      });
      return res.data;
    } catch (error) {
      console.error('TMDB upcoming error:', error);
      return { results: [], total_pages: 0 };
    }
  },

  search: async (query, page = 1) => {
    try {
      const res = await axios.get(`${TMDB_BASE}/search/multi`, {
        params: { api_key: TMDB_API_KEY, query, page }
      });
      return res.data;
    } catch (error) {
      console.error('TMDB search error:', error);
      return { results: [], total_pages: 0 };
    }
  },

  details: async (id, type = 'movie') => {
    try {
      const res = await axios.get(`${TMDB_BASE}/${type}/${id}`, {
        params: {
          api_key: TMDB_API_KEY,
          append_to_response: 'videos,credits,similar'
        }
      });
      return res.data;
    } catch (error) {
      console.error('TMDB details error:', error);
      return null;
    }
  }
};

// ======================
// TVMAZE API (FREE - No key needed!)
// ======================

export const tvmaze = {
  search: async (query) => {
    try {
      const res = await axios.get(`${TVMAZE_BASE}/search/shows`, {
        params: { q: query }
      });
      return res.data.map(item => ({
        id: item.show.id,
        name: item.show.name,
        image: item.show.image?.medium || '/placeholder-movie.jpg',
        summary: item.show.summary,
        rating: item.show.rating?.average || 'N/A',
        genres: item.show.genres
      }));
    } catch (error) {
      console.error('TVMaze search error:', error);
      return [];
    }
  },

  schedule: async (country = 'US') => {
    try {
      const res = await axios.get(`${TVMAZE_BASE}/schedule`, {
        params: { country, date: new Date().toISOString().split('T')[0] }
      });
      return res.data.slice(0, 20);
    } catch (error) {
      console.error('TVMaze schedule error:', error);
      return [];
    }
  }
};

// ======================
// OMDb API (Backup search)
// ======================

export const omdb = {
  search: async (query) => {
    try {
      const res = await axios.get(OMDB_BASE, {
        params: {
          apikey: OMDB_API_KEY,
          s: query,
          type: 'movie'
        }
      });
      if (res.data.Response === 'True') {
        return res.data.Search.map(movie => ({
          id: movie.imdbID,
          title: movie.Title,
          poster: movie.Poster !== 'N/A' ? movie.Poster : '/placeholder-movie.jpg',
          year: movie.Year
        }));
      }
      return [];
    } catch (error) {
      console.error('OMDb search error:', error);
      return [];
    }
  }
};

// ======================
// IMDbOT API (FREE - Unofficial IMDb)
// ======================

export const imdb = {
  search: async (query) => {
    try {
      const res = await axios.get(`${IMDB_BASE}/api/search`, {
        params: { query }
      });
      return res.data;
    } catch (error) {
      console.error('IMDbOT search error:', error);
      return [];
    }
  },

  movie: async (imdbId) => {
    try {
      const res = await axios.get(`${IMDB_BASE}/api/movie`, {
        params: { id: imdbId }
      });
      return res.data;
    } catch (error) {
      console.error('IMDbOT movie error:', error);
      return null;
    }
  }
};

// ======================
// QUOTES API (Entertainment)
// ======================

export const quotes = {
  random: async () => {
    try {
      const res = await axios.get(QUOTES_APIS.movies);
      return res.data;
    } catch (error) {
      console.error('Quotes error:', error);
      return { quote: 'The greatest glory in living lies not in never falling, but in rising every time we fall.', role: 'Nelson Mandela' };
    }
  },

  breakingBad: async () => {
    try {
      const res = await axios.get(QUOTES_APIS.breakingBad);
      return res.data[0];
    } catch (error) {
      return null;
    }
  }
};

// ======================
// DUAL ANIME API SYSTEM
// ======================

export const animeApi = {
  /**
   * Smart anime search - tries both APIs
   * @param {string} query - Search query
   * @returns {Promise<Object>} - Combined results from both APIs
   */
  search: async (query) => {
    try {
      const [hianimeResults, shashankResults] = await Promise.all([
        hianime.search(query, 1).catch(() => ({ animes: [] })),
        shashankAnime.search(query).catch(() => [])
      ]);

      return {
        hianime: hianimeResults.animes || [],
        shashank: shashankResults,
        combined: [
          ...hianimeResults.animes.map(a => ({ ...a, source: 'hianime' })),
          ...shashankResults.map(a => ({ ...a, source: 'shashank' }))
        ]
      };
    } catch (error) {
      console.error('Anime search error:', error);
      return { hianime: [], shashank: [], combined: [] };
    }
  },

  /**
   * Get anime from preferred source
   * @param {string} id - Anime ID
   * @param {string} source - 'hianime' or 'shashank'
   * @returns {Promise<Object>} - Anime details
   */
  getAnime: async (id, source = 'hianime') => {
    try {
      if (source === 'shashank') {
        const [episodes, epList] = await Promise.all([
          shashankAnime.getEpisodes(id, 'sub'),
          shashankAnime.getEpisodes(id, 'dub')
        ]);
        return {
          id,
          subEpisodes: episodes.episodes,
          dubEpisodes: epList.episodes,
          source: 'shashank'
        };
      } else {
        const data = await hianime.info(id);
        return { ...data, source: 'hianime' };
      }
    } catch (error) {
      console.error('Get anime error:', error);
      return null;
    }
  }
};

// ======================
// SMART SEARCH (Multiple APIs + Dual Anime)
// ======================

export const smartSearch = async (query) => {
  try {
    // Try TMDB first (movies + TV)
    const tmdbResults = await tmdb.search(query);
    if (tmdbResults.results && tmdbResults.results.length > 0) {
      return { source: 'TMDB', data: tmdbResults.results, type: 'mixed' };
    }

    // Try both anime APIs
    const animeResults = await animeApi.search(query);
    if (animeResults.combined.length > 0) {
      return { 
        source: 'Anime (Dual)', 
        data: animeResults.combined.map(anime => ({
          ...anime,
          media_type: 'anime',
          poster_path: anime.poster || anime.image,
          name: anime.title || anime.name
        })), 
        type: 'anime' 
      };
    }

    // Fallback to OMDb
    const omdbResults = await omdb.search(query);
    if (omdbResults.length > 0) {
      return { source: 'OMDb', data: omdbResults, type: 'movies' };
    }

    // Fallback to TVMaze for TV shows
    const tvmazeResults = await tvmaze.search(query);
    if (tvmazeResults.length > 0) {
      return { source: 'TVMaze', data: tvmazeResults, type: 'tv' };
    }

    return { source: 'none', data: [], type: 'none' };
  } catch (error) {
    console.error('Smart search error:', error);
    return { source: 'error', data: [], type: 'error' };
  }
};

// ======================
// EXPORT ALL
// ======================

export default {
  tmdb,
  tvmaze,
  omdb,
  imdb,
  quotes,
  hianime,
  shashankAnime,
  animeApi,
  smartSearch,
  getImageUrl
};
