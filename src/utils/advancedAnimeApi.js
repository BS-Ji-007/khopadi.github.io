import axios from 'axios';

// ============================================
// MULTIPLE ANIME API SOURCES - COMPREHENSIVE SYSTEM
// ============================================

// API Base URLs
const API_SOURCES = {
  // Primary HiAnime API (Most comprehensive)
  hianime: 'https://api-anime.consumet.stream/anime/hianime',
  hianime2: 'https://hianime-api2.vercel.app/api/v1',
  
  // Anime Mapper (Anilist to streaming platform mapper)
  animeMapper: 'https://anime-mapper.vercel.app',
  
  // ShashankBhake API (Sub/Dub support)
  shashankAnime: 'https://anime-api-one-murex.vercel.app',
  
  // Consumet API (Multiple sources)
  consumet: 'https://api.consumet.org',
  
  // Aniwatch API
  aniwatch: 'https://aniwatch-api.vercel.app/api/v2/hianime'
};

// ============================================
// HIANIME API2 (Most Advanced)
// ============================================

export const hianimeApi = {
  /**
   * Get anime home page data
   */
  home: async () => {
    try {
      const response = await axios.get(`${API_SOURCES.hianime2}/home`);
      return response.data?.data || null;
    } catch (error) {
      console.error('HiAnime home error:', error);
      return null;
    }
  },

  /**
   * Search anime
   */
  search: async (query, page = 1) => {
    try {
      const response = await axios.get(`${API_SOURCES.hianime2}/search`, {
        params: { keyword: query, page }
      });
      return response.data?.data || { animes: [], pageInfo: {} };
    } catch (error) {
      console.error('HiAnime search error:', error);
      return { animes: [], pageInfo: {} };
    }
  },

  /**
   * Get anime details
   */
  info: async (animeId) => {
    try {
      const response = await axios.get(`${API_SOURCES.hianime2}/anime/${animeId}`);
      return response.data?.data || null;
    } catch (error) {
      console.error('HiAnime info error:', error);
      return null;
    }
  },

  /**
   * Get anime episodes
   */
  episodes: async (animeId) => {
    try {
      const response = await axios.get(`${API_SOURCES.hianime2}/episodes/${animeId}`);
      return response.data?.data || { totalEpisodes: 0, episodes: [] };
    } catch (error) {
      console.error('HiAnime episodes error:', error);
      return { totalEpisodes: 0, episodes: [] };
    }
  },

  /**
   * Get episode servers
   */
  servers: async (episodeId) => {
    try {
      const response = await axios.get(`${API_SOURCES.hianime2}/servers`, {
        params: { id: episodeId }
      });
      return response.data?.data || { sub: [], dub: [] };
    } catch (error) {
      console.error('HiAnime servers error:', error);
      return { sub: [], dub: [] };
    }
  },

  /**
   * Get streaming sources
   */
  sources: async (episodeId, server = 'hd-1', type = 'sub') => {
    try {
      const response = await axios.get(`${API_SOURCES.hianime2}/stream`, {
        params: { id: episodeId, server, type }
      });
      return response.data?.data || null;
    } catch (error) {
      console.error('HiAnime sources error:', error);
      return null;
    }
  },

  /**
   * Get trending anime
   */
  trending: async (page = 1) => {
    try {
      const response = await axios.get(`${API_SOURCES.hianime2}/animes/top-airing`, {
        params: { page }
      });
      return response.data?.data || { animes: [], pageInfo: {} };
    } catch (error) {
      console.error('HiAnime trending error:', error);
      return { animes: [], pageInfo: {} };
    }
  },

  /**
   * Get anime by genre
   */
  genre: async (genre, page = 1) => {
    try {
      const response = await axios.get(`${API_SOURCES.hianime2}/animes/genre/${genre}`, {
        params: { page }
      });
      return response.data?.data || { animes: [], pageInfo: {} };
    } catch (error) {
      console.error('HiAnime genre error:', error);
      return { animes: [], pageInfo: {} };
    }
  },

  /**
   * Filter anime
   */
  filter: async (filters = {}) => {
    try {
      const response = await axios.get(`${API_SOURCES.hianime2}/filter`, {
        params: filters
      });
      return response.data?.data || { animes: [], pageInfo: {} };
    } catch (error) {
      console.error('HiAnime filter error:', error);
      return { animes: [], pageInfo: {} };
    }
  },

  /**
   * Get schedule
   */
  schedule: async (date = null) => {
    try {
      const params = date ? { date } : {};
      const response = await axios.get(`${API_SOURCES.hianime2}/schedules`, { params });
      return response.data?.data || {};
    } catch (error) {
      console.error('HiAnime schedule error:', error);
      return {};
    }
  },

  /**
   * Get random anime
   */
  random: async () => {
    try {
      const response = await axios.get(`${API_SOURCES.hianime2}/random`);
      return response.data?.data || null;
    } catch (error) {
      console.error('HiAnime random error:', error);
      return null;
    }
  }
};

// ============================================
// ANIME MAPPER (Anilist Integration)
// ============================================

export const animeMapper = {
  /**
   * Map Anilist ID to HiAnime
   */
  mapToHiAnime: async (anilistId) => {
    try {
      const response = await axios.get(`${API_SOURCES.animeMapper}/hianime/${anilistId}`);
      return response.data || null;
    } catch (error) {
      console.error('Anime Mapper HiAnime error:', error);
      return null;
    }
  },

  /**
   * Map Anilist ID to AnimePahe
   */
  mapToAnimePahe: async (anilistId) => {
    try {
      const response = await axios.get(`${API_SOURCES.animeMapper}/animepahe/map/${anilistId}`);
      return response.data || null;
    } catch (error) {
      console.error('Anime Mapper AnimePahe error:', error);
      return null;
    }
  },

  /**
   * Map Anilist ID to AnimeKai
   */
  mapToAnimeKai: async (anilistId) => {
    try {
      const response = await axios.get(`${API_SOURCES.animeMapper}/animekai/map/${anilistId}`);
      return response.data || null;
    } catch (error) {
      console.error('Anime Mapper AnimeKai error:', error);
      return null;
    }
  },

  /**
   * Get HiAnime episode sources
   */
  getHiAnimeSources: async (episodeId, ep, server = 'hd-1', category = 'sub') => {
    try {
      const response = await axios.get(
        `${API_SOURCES.animeMapper}/hianime/sources/${episodeId}`,
        { params: { ep, server, category } }
      );
      return response.data || null;
    } catch (error) {
      console.error('Anime Mapper sources error:', error);
      return null;
    }
  },

  /**
   * Get AnimePahe sources
   */
  getAnimePaheSources: async (session, episodeId) => {
    try {
      const response = await axios.get(
        `${API_SOURCES.animeMapper}/animepahe/sources/${session}/${episodeId}`
      );
      return response.data || null;
    } catch (error) {
      console.error('AnimePahe sources error:', error);
      return null;
    }
  },

  /**
   * Get AnimeKai sources
   */
  getAnimeKaiSources: async (episodeId, dub = false) => {
    try {
      const response = await axios.get(
        `${API_SOURCES.animeMapper}/animekai/sources/${episodeId}`,
        { params: { dub: dub ? 'true' : undefined } }
      );
      return response.data || null;
    } catch (error) {
      console.error('AnimeKai sources error:', error);
      return null;
    }
  }
};

// ============================================
// CONSUMET API
// ============================================

export const consumetApi = {
  /**
   * Search anime on multiple sources
   */
  searchMulti: async (query) => {
    try {
      const [gogoanime, zoro, animepahe] = await Promise.all([
        axios.get(`${API_SOURCES.consumet}/anime/gogoanime/${query}`).catch(() => ({ data: { results: [] } })),
        axios.get(`${API_SOURCES.consumet}/anime/zoro/${query}`).catch(() => ({ data: { results: [] } })),
        axios.get(`${API_SOURCES.consumet}/anime/animepahe/${query}`).catch(() => ({ data: { results: [] } }))
      ]);

      return {
        gogoanime: gogoanime.data?.results || [],
        zoro: zoro.data?.results || [],
        animepahe: animepahe.data?.results || []
      };
    } catch (error) {
      console.error('Consumet multi-search error:', error);
      return { gogoanime: [], zoro: [], animepahe: [] };
    }
  },

  /**
   * Get anime info from GoGoAnime
   */
  gogoInfo: async (animeId) => {
    try {
      const response = await axios.get(`${API_SOURCES.consumet}/anime/gogoanime/info/${animeId}`);
      return response.data || null;
    } catch (error) {
      console.error('GoGoAnime info error:', error);
      return null;
    }
  },

  /**
   * Get streaming links
   */
  gogoWatch: async (episodeId) => {
    try {
      const response = await axios.get(`${API_SOURCES.consumet}/anime/gogoanime/watch/${episodeId}`);
      return response.data || null;
    } catch (error) {
      console.error('GoGoAnime watch error:', error);
      return null;
    }
  }
};

// ============================================
// SMART ANIME SYSTEM (Combines All APIs)
// ============================================

export const smartAnimeApi = {
  /**
   * Intelligent search across multiple sources
   */
  search: async (query, page = 1) => {
    try {
      // Try HiAnime first (most reliable)
      const hianimeResults = await hianimeApi.search(query, page);
      if (hianimeResults.animes && hianimeResults.animes.length > 0) {
        return {
          source: 'hianime',
          data: hianimeResults.animes,
          pageInfo: hianimeResults.pageInfo
        };
      }

      // Fallback to Consumet
      const consumetResults = await consumetApi.searchMulti(query);
      const allResults = [
        ...consumetResults.zoro,
        ...consumetResults.gogoanime,
        ...consumetResults.animepahe
      ];

      if (allResults.length > 0) {
        return {
          source: 'consumet',
          data: allResults,
          pageInfo: { hasNextPage: false, currentPage: 1 }
        };
      }

      return {
        source: 'none',
        data: [],
        pageInfo: { hasNextPage: false, currentPage: 1 }
      };
    } catch (error) {
      console.error('Smart search error:', error);
      return {
        source: 'error',
        data: [],
        pageInfo: { hasNextPage: false, currentPage: 1 }
      };
    }
  },

  /**
   * Get anime with all available sources
   */
  getAnime: async (animeId, anilistId = null) => {
    try {
      const results = await Promise.allSettled([
        hianimeApi.info(animeId),
        anilistId ? animeMapper.mapToHiAnime(anilistId) : null
      ]);

      return {
        hianime: results[0].status === 'fulfilled' ? results[0].value : null,
        mapped: results[1].status === 'fulfilled' ? results[1].value : null
      };
    } catch (error) {
      console.error('Smart getAnime error:', error);
      return { hianime: null, mapped: null };
    }
  },

  /**
   * Get best streaming source
   */
  getStreamingSources: async (episodeId, server = 'hd-1', type = 'sub') => {
    try {
      // Try HiAnime first
      const hianimeSource = await hianimeApi.sources(episodeId, server, type);
      if (hianimeSource && hianimeSource.link) {
        return {
          source: 'hianime',
          data: hianimeSource,
          success: true
        };
      }

      return {
        source: 'none',
        data: null,
        success: false
      };
    } catch (error) {
      console.error('Smart streaming sources error:', error);
      return {
        source: 'error',
        data: null,
        success: false
      };
    }
  }
};

// ============================================
// EXPORT ALL
// ============================================

export default {
  hianimeApi,
  animeMapper,
  consumetApi,
  smartAnimeApi,
  API_SOURCES
};
