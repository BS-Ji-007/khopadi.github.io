import axios from 'axios';

// ============================================
// ALL ANIME API SOURCES - COMPLETE SYSTEM
// ============================================

// API Base URLs - COMPLETE LIST
const API_SOURCES = {
  // HiAnime APIs
  hianime: 'https://api-anime.consumet.stream/anime/hianime',
  hianime2: 'https://hianime-api2.vercel.app/api/v1', // ItsGloKeR
  hianimeYahya: 'https://hianime-api-yahya.vercel.app', // yahyaMomin
  aniwatchApi: 'https://aniwatch-api.vercel.app/api/v2/hianime', // ghoshRitesh12
  
  // Anime Mapper APIs
  animeMapper: 'https://anime-mapper.vercel.app', // shafat-96
  hianimeMapper: 'https://hianime-mapper.vercel.app', // IrfanKhan66
  hianimeEpisodeMapper: 'https://hianime-episode-mapper.vercel.app', // shafat-96
  
  // Consumet APIs
  consumet: 'https://api.consumet.org', // consumet
  consumetOfficial: 'https://consumet-api.vercel.app', // Official
  
  // Other APIs
  shashankAnime: 'https://anime-api-one-murex.vercel.app', // ShashankBhake
  erickAnimeWebsite: 'https://anime-website-api.vercel.app', // ErickLimaS
  aniFire: 'https://ani-fire-api.vercel.app', // Zeddxx
  
  // Proxy & Utilities
  m3u8Proxy: 'https://m3u8-proxy.vercel.app', // ItsGloKeR
  m3u8ProxyAlperen: 'https://m3u8-proxy-alperen.vercel.app', // AlperenBayam
  corsWorker: 'https://cors-worker.vercel.app', // ItsGloKeR
  corsAnywhere: 'https://cors-anywhere.herokuapp.com', // Rob--W
  anilistProxy: 'https://anilist-proxy.vercel.app', // ItsGloKeR
  
  // Zenime Projects (ItsGloKeR)
  zenime: 'https://zenime.vercel.app', // itzzzme
  zemnimeWeb: 'https://zemnime-web.vercel.app', // ItsGloKeR
  webZen: 'https://webzen.vercel.app', // ItsGloKeR
  webAppsenim: 'https://weappsenim.vercel.app', // ItsGloKeR
  senim: 'https://senim.vercel.app', // ItsGloKeR
  
  // Other Projects
  api3: 'https://api3-itsgloker.vercel.app', // ItsGloKeR
  gits: 'https://gits.vercel.app', // ItsGloKeR
  
  // Hentai API (Adult Content)
  hentaiApi: 'https://hentai-api-shimizu.vercel.app' // shimizudev
};

// ============================================
// HIANIME API2 (Primary - Most Advanced)
// ============================================

export const hianimeApi = {
  home: async () => {
    try {
      const response = await axios.get(`${API_SOURCES.hianime2}/home`);
      return response.data?.data || null;
    } catch (error) {
      console.error('HiAnime home error:', error);
      return null;
    }
  },

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

  info: async (animeId) => {
    try {
      const response = await axios.get(`${API_SOURCES.hianime2}/anime/${animeId}`);
      return response.data?.data || null;
    } catch (error) {
      console.error('HiAnime info error:', error);
      return null;
    }
  },

  episodes: async (animeId) => {
    try {
      const response = await axios.get(`${API_SOURCES.hianime2}/episodes/${animeId}`);
      return response.data?.data || { totalEpisodes: 0, episodes: [] };
    } catch (error) {
      console.error('HiAnime episodes error:', error);
      return { totalEpisodes: 0, episodes: [] };
    }
  },

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
  mapToHiAnime: async (anilistId) => {
    try {
      const response = await axios.get(`${API_SOURCES.animeMapper}/hianime/${anilistId}`);
      return response.data || null;
    } catch (error) {
      console.error('Anime Mapper HiAnime error:', error);
      return null;
    }
  },

  mapToAnimePahe: async (anilistId) => {
    try {
      const response = await axios.get(`${API_SOURCES.animeMapper}/animepahe/map/${anilistId}`);
      return response.data || null;
    } catch (error) {
      console.error('Anime Mapper AnimePahe error:', error);
      return null;
    }
  },

  mapToAnimeKai: async (anilistId) => {
    try {
      const response = await axios.get(`${API_SOURCES.animeMapper}/animekai/map/${anilistId}`);
      return response.data || null;
    } catch (error) {
      console.error('Anime Mapper AnimeKai error:', error);
      return null;
    }
  },

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
// HIANIME MAPPER (Episode Mapping)
// ============================================

export const hianimeMapperApi = {
  mapEpisodes: async (malId) => {
    try {
      const response = await axios.get(`${API_SOURCES.hianimeMapper}/api/map/${malId}`);
      return response.data || null;
    } catch (error) {
      console.error('HiAnime Mapper error:', error);
      return null;
    }
  },

  getEpisodeInfo: async (hianimeId, episodeNumber) => {
    try {
      const response = await axios.get(
        `${API_SOURCES.hianimeEpisodeMapper}/api/episode/${hianimeId}/${episodeNumber}`
      );
      return response.data || null;
    } catch (error) {
      console.error('Episode Mapper error:', error);
      return null;
    }
  }
};

// ============================================
// CONSUMET API (Multiple Sources)
// ============================================

export const consumetApi = {
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

  gogoInfo: async (animeId) => {
    try {
      const response = await axios.get(`${API_SOURCES.consumet}/anime/gogoanime/info/${animeId}`);
      return response.data || null;
    } catch (error) {
      console.error('GoGoAnime info error:', error);
      return null;
    }
  },

  gogoWatch: async (episodeId) => {
    try {
      const response = await axios.get(`${API_SOURCES.consumet}/anime/gogoanime/watch/${episodeId}`);
      return response.data || null;
    } catch (error) {
      console.error('GoGoAnime watch error:', error);
      return null;
    }
  },

  // Consumet Official API
  searchOfficial: async (query, page = 1) => {
    try {
      const response = await axios.get(`${API_SOURCES.consumetOfficial}/meta/anilist/${query}`, {
        params: { page }
      });
      return response.data || null;
    } catch (error) {
      console.error('Consumet official search error:', error);
      return null;
    }
  },

  infoOfficial: async (id) => {
    try {
      const response = await axios.get(`${API_SOURCES.consumetOfficial}/meta/anilist/info/${id}`);
      return response.data || null;
    } catch (error) {
      console.error('Consumet official info error:', error);
      return null;
    }
  },

  watchOfficial: async (episodeId) => {
    try {
      const response = await axios.get(`${API_SOURCES.consumetOfficial}/meta/anilist/watch/${episodeId}`);
      return response.data || null;
    } catch (error) {
      console.error('Consumet official watch error:', error);
      return null;
    }
  }
};

// ============================================
// ANIWATCH API (Alternative HiAnime)
// ============================================

export const aniwatchApi = {
  home: async () => {
    try {
      const response = await axios.get(`${API_SOURCES.aniwatchApi}/home`);
      return response.data || null;
    } catch (error) {
      console.error('Aniwatch home error:', error);
      return null;
    }
  },

  search: async (query) => {
    try {
      const response = await axios.get(`${API_SOURCES.aniwatchApi}/search`, {
        params: { q: query }
      });
      return response.data || null;
    } catch (error) {
      console.error('Aniwatch search error:', error);
      return null;
    }
  },

  info: async (id) => {
    try {
      const response = await axios.get(`${API_SOURCES.aniwatchApi}/anime/${id}`);
      return response.data || null;
    } catch (error) {
      console.error('Aniwatch info error:', error);
      return null;
    }
  },

  episodes: async (id) => {
    try {
      const response = await axios.get(`${API_SOURCES.aniwatchApi}/anime/${id}/episodes`);
      return response.data || null;
    } catch (error) {
      console.error('Aniwatch episodes error:', error);
      return null;
    }
  },

  servers: async (episodeId) => {
    try {
      const response = await axios.get(`${API_SOURCES.aniwatchApi}/episode/servers`, {
        params: { episodeId }
      });
      return response.data || null;
    } catch (error) {
      console.error('Aniwatch servers error:', error);
      return null;
    }
  },

  sources: async (episodeId, server = 'hd-1', category = 'sub') => {
    try {
      const response = await axios.get(`${API_SOURCES.aniwatchApi}/episode/sources`, {
        params: { episodeId, server, category }
      });
      return response.data || null;
    } catch (error) {
      console.error('Aniwatch sources error:', error);
      return null;
    }
  }
};

// ============================================
// ANILIST PROXY (For Anilist GraphQL)
// ============================================

export const anilistProxy = {
  query: async (graphqlQuery, variables = {}) => {
    try {
      const response = await axios.post(`${API_SOURCES.anilistProxy}/graphql`, {
        query: graphqlQuery,
        variables
      });
      return response.data || null;
    } catch (error) {
      console.error('Anilist proxy error:', error);
      return null;
    }
  },

  getAnime: async (id) => {
    const query = `
      query ($id: Int) {
        Media (id: $id, type: ANIME) {
          id
          title { romaji english native }
          coverImage { large }
          bannerImage
          episodes
          status
          genres
          averageScore
          description
        }
      }
    `;
    return await anilistProxy.query(query, { id });
  },

  search: async (query) => {
    const graphqlQuery = `
      query ($search: String) {
        Page (perPage: 20) {
          media (search: $search, type: ANIME) {
            id
            title { romaji english }
            coverImage { large }
            episodes
            averageScore
          }
        }
      }
    `;
    return await anilistProxy.query(graphqlQuery, { search: query });
  }
};

// ============================================
// HENTAI API (Adult Content - 18+)
// ============================================

export const hentaiApi = {
  search: async (query) => {
    try {
      const response = await axios.get(`${API_SOURCES.hentaiApi}/search`, {
        params: { q: query }
      });
      return response.data || null;
    } catch (error) {
      console.error('Hentai search error:', error);
      return null;
    }
  },

  info: async (id) => {
    try {
      const response = await axios.get(`${API_SOURCES.hentaiApi}/info/${id}`);
      return response.data || null;
    } catch (error) {
      console.error('Hentai info error:', error);
      return null;
    }
  },

  watch: async (episodeId) => {
    try {
      const response = await axios.get(`${API_SOURCES.hentaiApi}/watch/${episodeId}`);
      return response.data || null;
    } catch (error) {
      console.error('Hentai watch error:', error);
      return null;
    }
  }
};

// ============================================
// SMART ANIME SYSTEM (Auto-Fallback)
// ============================================

export const smartAnimeApi = {
  search: async (query, page = 1) => {
    try {
      // Try HiAnime2 first (most reliable)
      const hianimeResults = await hianimeApi.search(query, page);
      if (hianimeResults.animes && hianimeResults.animes.length > 0) {
        return { source: 'hianime2', data: hianimeResults.animes, pageInfo: hianimeResults.pageInfo };
      }

      // Try Aniwatch
      const aniwatchResults = await aniwatchApi.search(query);
      if (aniwatchResults?.data?.animes && aniwatchResults.data.animes.length > 0) {
        return { source: 'aniwatch', data: aniwatchResults.data.animes, pageInfo: {} };
      }

      // Fallback to Consumet
      const consumetResults = await consumetApi.searchMulti(query);
      const allResults = [...consumetResults.zoro, ...consumetResults.gogoanime, ...consumetResults.animepahe];
      if (allResults.length > 0) {
        return { source: 'consumet', data: allResults, pageInfo: { hasNextPage: false, currentPage: 1 } };
      }

      // Try Consumet Official
      const officialResults = await consumetApi.searchOfficial(query, page);
      if (officialResults?.results && officialResults.results.length > 0) {
        return { source: 'consumet-official', data: officialResults.results, pageInfo: {} };
      }

      return { source: 'none', data: [], pageInfo: { hasNextPage: false, currentPage: 1 } };
    } catch (error) {
      console.error('Smart search error:', error);
      return { source: 'error', data: [], pageInfo: { hasNextPage: false, currentPage: 1 } };
    }
  },

  getAnime: async (animeId, anilistId = null) => {
    try {
      const results = await Promise.allSettled([
        hianimeApi.info(animeId),
        aniwatchApi.info(animeId),
        anilistId ? animeMapper.mapToHiAnime(anilistId) : null,
        anilistId ? anilistProxy.getAnime(anilistId) : null
      ]);

      return {
        hianime: results[0].status === 'fulfilled' ? results[0].value : null,
        aniwatch: results[1].status === 'fulfilled' ? results[1].value : null,
        mapped: results[2].status === 'fulfilled' ? results[2].value : null,
        anilist: results[3].status === 'fulfilled' ? results[3].value : null
      };
    } catch (error) {
      console.error('Smart getAnime error:', error);
      return { hianime: null, aniwatch: null, mapped: null, anilist: null };
    }
  },

  getStreamingSources: async (episodeId, server = 'hd-1', type = 'sub') => {
    try {
      // Try HiAnime2 first
      const hianimeSource = await hianimeApi.sources(episodeId, server, type);
      if (hianimeSource && hianimeSource.link) {
        return { source: 'hianime2', data: hianimeSource, success: true };
      }

      // Try Aniwatch
      const aniwatchSource = await aniwatchApi.sources(episodeId, server, type);
      if (aniwatchSource && aniwatchSource.sources) {
        return { source: 'aniwatch', data: aniwatchSource, success: true };
      }

      // Try Consumet Official
      const consumetSource = await consumetApi.watchOfficial(episodeId);
      if (consumetSource && consumetSource.sources) {
        return { source: 'consumet', data: consumetSource, success: true };
      }

      return { source: 'none', data: null, success: false };
    } catch (error) {
      console.error('Smart streaming sources error:', error);
      return { source: 'error', data: null, success: false };
    }
  }
};

// ============================================
// EXPORT ALL
// ============================================

export default {
  hianimeApi,
  animeMapper,
  hianimeMapperApi,
  consumetApi,
  aniwatchApi,
  anilistProxy,
  hentaiApi,
  smartAnimeApi,
  API_SOURCES
};
