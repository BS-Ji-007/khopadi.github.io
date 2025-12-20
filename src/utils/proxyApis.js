import axios from 'axios';

// ==============================================
// ALL PROXY & UTILITY APIs FROM ITSGLOKER REPOS
// ==============================================

// CORS Proxy Worker (Cloudflare Worker)
const CORS_WORKERS = [
  'https://cors-proxy-worker.itsgloker.workers.dev',
  'https://corsworker.vercel.app',
  'https://cors-anywhere.herokuapp.com'
];

// M3U8 Proxy (For video streaming)
const M3U8_PROXIES = [
  'https://m3u8proxy.itsgloker.workers.dev',
  'https://m3u8proxymd.vercel.app'
];

// Anilist Proxy (For anime data)
const ANILIST_PROXY = 'https://anilistproxy.vercel.app';

let currentCorsIndex = 0;
let currentM3u8Index = 0;

// ==============================================
// CORS PROXY - Bypass CORS restrictions
// ==============================================

export const corsProxy = {
  /**
   * Proxy any URL through CORS worker
   * @param {string} url - URL to proxy
   * @returns {string} Proxied URL
   */
  getUrl: (url) => {
    return `${CORS_WORKERS[currentCorsIndex]}/${url}`;
  },

  /**
   * Fetch data through CORS proxy
   * @param {string} url - URL to fetch
   * @param {object} options - Axios options
   */
  fetch: async (url, options = {}) => {
    for (let i = 0; i < CORS_WORKERS.length; i++) {
      try {
        const proxyUrl = `${CORS_WORKERS[(currentCorsIndex + i) % CORS_WORKERS.length]}/${url}`;
        const response = await axios.get(proxyUrl, {
          ...options,
          timeout: 10000
        });
        currentCorsIndex = (currentCorsIndex + i) % CORS_WORKERS.length;
        return response.data;
      } catch (error) {
        console.error(`CORS Proxy ${i + 1} failed:`, error.message);
        if (i === CORS_WORKERS.length - 1) {
          throw new Error('All CORS proxies failed');
        }
      }
    }
  },

  /**
   * Switch to next CORS proxy
   */
  switchServer: () => {
    currentCorsIndex = (currentCorsIndex + 1) % CORS_WORKERS.length;
    return CORS_WORKERS[currentCorsIndex];
  },

  /**
   * Get all available CORS proxies
   */
  getServers: () => CORS_WORKERS,

  /**
   * Get current proxy
   */
  getCurrentServer: () => CORS_WORKERS[currentCorsIndex]
};

// ==============================================
// M3U8 PROXY - For video streaming with CORS
// ==============================================

export const m3u8Proxy = {
  /**
   * Proxy M3U8 playlist URL
   * @param {string} url - M3U8 URL
   * @param {string} referer - Optional referer
   * @returns {string} Proxied M3U8 URL
   */
  getUrl: (url, referer = '') => {
    const encodedUrl = encodeURIComponent(url);
    const encodedRef = referer ? `&referer=${encodeURIComponent(referer)}` : '';
    return `${M3U8_PROXIES[currentM3u8Index]}?url=${encodedUrl}${encodedRef}`;
  },

  /**
   * Fetch M3U8 playlist through proxy
   * @param {string} url - M3U8 URL
   * @param {string} referer - Optional referer
   */
  fetch: async (url, referer = '') => {
    for (let i = 0; i < M3U8_PROXIES.length; i++) {
      try {
        const proxyUrl = m3u8Proxy.getUrl(url, referer);
        const response = await axios.get(proxyUrl, { timeout: 10000 });
        currentM3u8Index = (currentM3u8Index + i) % M3U8_PROXIES.length;
        return response.data;
      } catch (error) {
        console.error(`M3U8 Proxy ${i + 1} failed:`, error.message);
        if (i === M3U8_PROXIES.length - 1) {
          throw new Error('All M3U8 proxies failed');
        }
      }
    }
  },

  /**
   * Proxy video segments
   * @param {string} url - Segment URL
   * @param {string} referer - Optional referer
   */
  getSegmentUrl: (url, referer = '') => {
    return m3u8Proxy.getUrl(url, referer);
  },

  /**
   * Switch to next M3U8 proxy
   */
  switchServer: () => {
    currentM3u8Index = (currentM3u8Index + 1) % M3U8_PROXIES.length;
    return M3U8_PROXIES[currentM3u8Index];
  },

  /**
   * Get all M3U8 proxies
   */
  getServers: () => M3U8_PROXIES,

  /**
   * Get current M3U8 proxy
   */
  getCurrentServer: () => M3U8_PROXIES[currentM3u8Index]
};

// ==============================================
// ANILIST PROXY - GraphQL API for anime data
// ==============================================

export const anilistProxy = {
  /**
   * Query Anilist GraphQL API
   * @param {string} query - GraphQL query
   * @param {object} variables - Query variables
   */
  query: async (query, variables = {}) => {
    try {
      const response = await axios.post(ANILIST_PROXY, {
        query,
        variables
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });
      return response.data.data;
    } catch (error) {
      console.error('Anilist proxy error:', error);
      throw error;
    }
  },

  /**
   * Search anime on Anilist
   * @param {string} search - Search query
   * @param {number} page - Page number
   */
  searchAnime: async (search, page = 1) => {
    const query = `
      query ($search: String, $page: Int) {
        Page(page: $page, perPage: 20) {
          pageInfo {
            total
            currentPage
            lastPage
            hasNextPage
          }
          media(search: $search, type: ANIME) {
            id
            title {
              romaji
              english
              native
            }
            coverImage {
              large
              medium
            }
            bannerImage
            genres
            averageScore
            popularity
            episodes
            format
            status
            season
            seasonYear
            description
          }
        }
      }
    `;
    
    try {
      const data = await anilistProxy.query(query, { search, page });
      return data.Page;
    } catch (error) {
      console.error('Anilist search error:', error);
      return { media: [], pageInfo: {} };
    }
  },

  /**
   * Get anime details by ID
   * @param {number} id - Anilist anime ID
   */
  getAnimeDetails: async (id) => {
    const query = `
      query ($id: Int) {
        Media(id: $id, type: ANIME) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            large
            extraLarge
          }
          bannerImage
          genres
          averageScore
          popularity
          episodes
          duration
          format
          status
          season
          seasonYear
          description
          startDate {
            year
            month
            day
          }
          endDate {
            year
            month
            day
          }
          studios {
            nodes {
              name
            }
          }
          characters(perPage: 10) {
            nodes {
              id
              name {
                full
              }
              image {
                large
              }
            }
          }
          relations {
            edges {
              relationType
              node {
                id
                title {
                  romaji
                }
                coverImage {
                  medium
                }
              }
            }
          }
        }
      }
    `;
    
    try {
      const data = await anilistProxy.query(query, { id });
      return data.Media;
    } catch (error) {
      console.error('Anilist details error:', error);
      return null;
    }
  },

  /**
   * Get trending anime
   * @param {number} page - Page number
   */
  getTrending: async (page = 1) => {
    const query = `
      query ($page: Int) {
        Page(page: $page, perPage: 20) {
          media(sort: TRENDING_DESC, type: ANIME) {
            id
            title {
              romaji
              english
            }
            coverImage {
              large
            }
            averageScore
            episodes
            format
          }
        }
      }
    `;
    
    try {
      const data = await anilistProxy.query(query, { page });
      return data.Page.media;
    } catch (error) {
      console.error('Anilist trending error:', error);
      return [];
    }
  },

  /**
   * Get popular anime
   * @param {number} page - Page number
   */
  getPopular: async (page = 1) => {
    const query = `
      query ($page: Int) {
        Page(page: $page, perPage: 20) {
          media(sort: POPULARITY_DESC, type: ANIME) {
            id
            title {
              romaji
              english
            }
            coverImage {
              large
            }
            averageScore
            episodes
            format
          }
        }
      }
    `;
    
    try {
      const data = await anilistProxy.query(query, { page });
      return data.Page.media;
    } catch (error) {
      console.error('Anilist popular error:', error);
      return [];
    }
  }
};

// ==============================================
// UTILITY FUNCTIONS
// ==============================================

/**
 * Smart proxy selector - Choose best proxy for URL
 * @param {string} url - URL to proxy
 * @param {string} type - Type of content (video, api, image)
 */
export const smartProxy = (url, type = 'api') => {
  if (type === 'video' && (url.includes('.m3u8') || url.includes('.ts'))) {
    return m3u8Proxy.getUrl(url);
  }
  return corsProxy.getUrl(url);
};

/**
 * Test all proxies and return working ones
 */
export const testProxies = async () => {
  const results = {
    cors: [],
    m3u8: [],
    anilist: false
  };

  // Test CORS proxies
  for (const proxy of CORS_WORKERS) {
    try {
      await axios.get(`${proxy}/https://httpbin.org/get`, { timeout: 5000 });
      results.cors.push(proxy);
    } catch (error) {
      console.log(`CORS proxy ${proxy} failed`);
    }
  }

  // Test M3U8 proxies
  for (const proxy of M3U8_PROXIES) {
    try {
      await axios.get(proxy, { timeout: 5000 });
      results.m3u8.push(proxy);
    } catch (error) {
      console.log(`M3U8 proxy ${proxy} failed`);
    }
  }

  // Test Anilist proxy
  try {
    await anilistProxy.getTrending(1);
    results.anilist = true;
  } catch (error) {
    console.log('Anilist proxy failed');
  }

  return results;
};

// Export all
export default {
  corsProxy,
  m3u8Proxy,
  anilistProxy,
  smartProxy,
  testProxies
};
