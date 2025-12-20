import axios from 'axios';

// HiAnime API Configuration (Multiple Servers)
const HIANIME_SERVERS = [
  'https://hianime-api2.vercel.app',
  'https://api-aniwatch.onrender.com',
  'https://hianime-api.onrender.com',
  'https://api.aniwatch.pro'
];

let currentServerIndex = 0;

const getBaseUrl = () => HIANIME_SERVERS[currentServerIndex];

export const switchServer = (index) => {
  if (index >= 0 && index < HIANIME_SERVERS.length) {
    currentServerIndex = index;
    return true;
  }
  return false;
};

export const getCurrentServer = () => currentServerIndex;
export const getAllServers = () => HIANIME_SERVERS;

// Helper function with retry logic
const apiCall = async (endpoint, params = {}) => {
  for (let i = 0; i < HIANIME_SERVERS.length; i++) {
    try {
      const url = `${HIANIME_SERVERS[(currentServerIndex + i) % HIANIME_SERVERS.length]}/api/v1${endpoint}`;
      const res = await axios.get(url, { params, timeout: 10000 });
      if (res.data.success) {
        currentServerIndex = (currentServerIndex + i) % HIANIME_SERVERS.length;
        return res.data.data;
      }
    } catch (error) {
      console.error(`Server ${i + 1} failed:`, error.message);
      if (i === HIANIME_SERVERS.length - 1) {
        throw new Error('All anime servers are down');
      }
    }
  }
};

// HiAnime API Functions
export const hianime = {
  // Home page data
  home: async () => {
    try {
      return await apiCall('/home');
    } catch (error) {
      console.error('HiAnime home error:', error);
      return null;
    }
  },

  // Search anime
  search: async (query, page = 1) => {
    try {
      return await apiCall('/search', { keyword: query, page });
    } catch (error) {
      console.error('HiAnime search error:', error);
      return { animes: [], pageInfo: {} };
    }
  },

  // Anime details
  details: async (id) => {
    try {
      return await apiCall(`/anime/${id}`);
    } catch (error) {
      console.error('HiAnime details error:', error);
      return null;
    }
  },

  // Get episodes
  episodes: async (id) => {
    try {
      return await apiCall(`/episodes/${id}`);
    } catch (error) {
      console.error('HiAnime episodes error:', error);
      return { episodes: [] };
    }
  },

  // Get episode servers
  servers: async (episodeId) => {
    try {
      return await apiCall('/servers', { id: episodeId });
    } catch (error) {
      console.error('HiAnime servers error:', error);
      return { sub: [], dub: [] };
    }
  },

  // Get streaming links
  stream: async (episodeId, server = 'hd-1', type = 'sub') => {
    try {
      return await apiCall('/stream', { id: episodeId, server, type });
    } catch (error) {
      console.error('HiAnime stream error:', error);
      return null;
    }
  },

  // Top airing
  topAiring: async (page = 1) => {
    try {
      return await apiCall('/animes/top-airing', { page });
    } catch (error) {
      console.error('HiAnime top airing error:', error);
      return { animes: [], pageInfo: {} };
    }
  },

  // Most popular
  popular: async (page = 1) => {
    try {
      return await apiCall('/animes/most-popular', { page });
    } catch (error) {
      console.error('HiAnime popular error:', error);
      return { animes: [], pageInfo: {} };
    }
  },

  // Recent episodes
  recentEpisodes: async (page = 1) => {
    try {
      return await apiCall('/animes/recently-updated', { page });
    } catch (error) {
      console.error('HiAnime recent error:', error);
      return { animes: [], pageInfo: {} };
    }
  },

  // Get genres
  genres: async () => {
    try {
      return await apiCall('/genres');
    } catch (error) {
      console.error('HiAnime genres error:', error);
      return [];
    }
  },

  // Filter anime
  filter: async (filters = {}, page = 1) => {
    try {
      return await apiCall('/filter', { ...filters, page });
    } catch (error) {
      console.error('HiAnime filter error:', error);
      return { animes: [], pageInfo: {} };
    }
  },

  // Random anime
  random: async () => {
    try {
      const data = await apiCall('/random');
      return data?.id || null;
    } catch (error) {
      console.error('HiAnime random error:', error);
      return null;
    }
  },

  // Schedule
  schedule: async (date) => {
    try {
      return await apiCall('/schedules', date ? { date } : {});
    } catch (error) {
      console.error('HiAnime schedule error:', error);
      return {};
    }
  }
};

export default hianime;
