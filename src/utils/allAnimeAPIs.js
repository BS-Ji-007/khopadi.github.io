/**
 * ============================================
 * ALL 24 ANIME APIs INTEGRATION
 * Complete anime streaming ecosystem
 * ============================================
 */

// ============================================
// 1. HIANIME API 2 (ItsGloKeR)
// ============================================
export const hianimeApi2 = {
  baseUrl: 'https://hianime-api2.vercel.app',
  
  async search(query) {
    const res = await fetch(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`);
    return res.json();
  },
  
  async info(animeId) {
    const res = await fetch(`${this.baseUrl}/anime/${animeId}`);
    return res.json();
  },
  
  async episodes(animeId) {
    const res = await fetch(`${this.baseUrl}/anime/${animeId}/episodes`);
    return res.json();
  },
  
  async servers(episodeId) {
    const res = await fetch(`${this.baseUrl}/episode/${episodeId}/servers`);
    return res.json();
  },
  
  async sources(episodeId, server = 'hd-1', category = 'sub') {
    const res = await fetch(`${this.baseUrl}/episode/${episodeId}/sources?server=${server}&category=${category}`);
    return res.json();
  }
};

// ============================================
// 2. MIRURO API (Consumet Based)
// ============================================
export const miruroApi = {
  baseUrl: 'https://api.consumet.org/anime',
  
  async searchAnilist(query) {
    const res = await fetch(`${this.baseUrl}/anilist/${query}`);
    return res.json();
  },
  
  async getInfo(id) {
    const res = await fetch(`${this.baseUrl}/anilist/info/${id}`);
    return res.json();
  },
  
  async getEpisodes(id) {
    const res = await fetch(`${this.baseUrl}/anilist/info/${id}`);
    const data = await res.json();
    return data.episodes || [];
  },
  
  async getSources(episodeId, provider = 'gogoanime') {
    const res = await fetch(`${this.baseUrl}/anilist/watch/${episodeId}?provider=${provider}`);
    return res.json();
  }
};

// ============================================
// 3. ANIME MAPPER (shafat-96)
// ============================================
export const animeMapper = {
  baseUrl: 'https://anime-mapper.vercel.app',
  
  async mapAnimePahe(anilistId) {
    const res = await fetch(`${this.baseUrl}/animepahe/map/${anilistId}`);
    return res.json();
  },
  
  async mapHiAnime(anilistId) {
    const res = await fetch(`${this.baseUrl}/hianime/${anilistId}`);
    return res.json();
  },
  
  async mapAnimeKai(anilistId) {
    const res = await fetch(`${this.baseUrl}/animekai/map/${anilistId}`);
    return res.json();
  },
  
  async getAnimePaheSources(session, episodeId) {
    const res = await fetch(`${this.baseUrl}/animepahe/sources/${session}/${episodeId}`);
    return res.json();
  },
  
  async getHiAnimeSources(episodeId, ep, server = 'vidstreaming', category = 'sub') {
    const res = await fetch(`${this.baseUrl}/hianime/sources/${episodeId}?ep=${ep}&server=${server}&category=${category}`);
    return res.json();
  },
  
  async getAnimeKaiSources(episodeId, dub = false) {
    const res = await fetch(`${this.baseUrl}/animekai/sources/${episodeId}?dub=${dub}`);
    return res.json();
  }
};

// ============================================
// 4. M3U8 PROXY MD (ItsGloKeR)
// ============================================
export const m3u8ProxyMd = {
  baseUrl: 'https://m3u8proxymd.vercel.app',
  
  proxyUrl(url) {
    return `${this.baseUrl}/proxy?url=${encodeURIComponent(url)}`;
  },
  
  async fetchWithProxy(m3u8Url) {
    const res = await fetch(this.proxyUrl(m3u8Url));
    return res.text();
  }
};

// ============================================
// 5. ZENIME API (itzzzme)
// ============================================
export const zenimeApi = {
  baseUrl: 'https://zenime-api.vercel.app',
  
  async search(query) {
    const res = await fetch(`${this.baseUrl}/search?query=${encodeURIComponent(query)}`);
    return res.json();
  },
  
  async getAnime(id) {
    const res = await fetch(`${this.baseUrl}/anime/${id}`);
    return res.json();
  },
  
  async getEpisodes(id) {
    const res = await fetch(`${this.baseUrl}/episodes/${id}`);
    return res.json();
  },
  
  async getSources(episodeId) {
    const res = await fetch(`${this.baseUrl}/source/${episodeId}`);
    return res.json();
  }
};

// ============================================
// 6. CORS WORKER (ItsGloKeR)
// ============================================
export const corsWorker = {
  baseUrl: 'https://corsworker.vercel.app',
  
  proxyUrl(url) {
    return `${this.baseUrl}/?url=${encodeURIComponent(url)}`;
  },
  
  async fetch(url, options = {}) {
    const res = await fetch(this.proxyUrl(url), options);
    return res;
  }
};

// ============================================
// 7. ANIME API (ShashankBhake)
// ============================================
export const shashankAnimeApi = {
  baseUrl: 'https://anime-api-shashank.vercel.app',
  
  async trending() {
    const res = await fetch(`${this.baseUrl}/trending`);
    return res.json();
  },
  
  async popular() {
    const res = await fetch(`${this.baseUrl}/popular`);
    return res.json();
  },
  
  async search(query) {
    const res = await fetch(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`);
    return res.json();
  },
  
  async info(id) {
    const res = await fetch(`${this.baseUrl}/info/${id}`);
    return res.json();
  }
};

// ============================================
// 8. ANILIST PROXY (ItsGloKeR)
// ============================================
export const anilistProxy = {
  baseUrl: 'https://anilistproxy.vercel.app',
  
  async query(graphqlQuery, variables = {}) {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: graphqlQuery, variables })
    });
    return res.json();
  },
  
  async getAnime(id) {
    const query = `
      query ($id: Int) {
        Media(id: $id, type: ANIME) {
          id title { romaji english native }
          coverImage { large }
          episodes season seasonYear
          genres status
        }
      }
    `;
    return this.query(query, { id });
  }
};

// ============================================
// 9. ZEMNIME WEB (ItsGloKeR)
// ============================================
export const zemnimeWeb = {
  baseUrl: 'https://zemnimeweb.vercel.app',
  
  async getHome() {
    const res = await fetch(`${this.baseUrl}/api/home`);
    return res.json();
  },
  
  async search(query) {
    const res = await fetch(`${this.baseUrl}/api/search?q=${encodeURIComponent(query)}`);
    return res.json();
  }
};

// ============================================
// 10. M3U8 PROXY (AlperenBayam)
// ============================================
export const m3u8ProxyAlperen = {
  baseUrl: 'https://m3u8-proxy-coral.vercel.app',
  
  proxyUrl(url) {
    return `${this.baseUrl}/m3u8-proxy?url=${encodeURIComponent(url)}`;
  },
  
  async fetchM3U8(url) {
    const res = await fetch(this.proxyUrl(url));
    return res.text();
  }
};

// ============================================
// 11. HIANIME API (yahyaMomin)
// ============================================
export const yahyaHiAnimeApi = {
  baseUrl: 'https://hianime-api-yahya.vercel.app',
  
  async search(query, page = 1) {
    const res = await fetch(`${this.baseUrl}/search?q=${encodeURIComponent(query)}&page=${page}`);
    return res.json();
  },
  
  async info(id) {
    const res = await fetch(`${this.baseUrl}/anime/${id}`);
    return res.json();
  },
  
  async episodes(id) {
    const res = await fetch(`${this.baseUrl}/episodes/${id}`);
    return res.json();
  },
  
  async sources(episodeId) {
    const res = await fetch(`${this.baseUrl}/sources/${episodeId}`);
    return res.json();
  }
};

// ============================================
// 12. HENTAI API (shimizudev)
// ============================================
export const hentaiApi = {
  baseUrl: 'https://hentai-api-shimizu.vercel.app',
  
  async getTrending() {
    const res = await fetch(`${this.baseUrl}/trending`);
    return res.json();
  },
  
  async search(query) {
    const res = await fetch(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`);
    return res.json();
  },
  
  async getEpisodes(id) {
    const res = await fetch(`${this.baseUrl}/watch/${id}`);
    return res.json();
  }
};

// ============================================
// 13. WEAPPSENIM (ItsGloKeR)
// ============================================
export const weappsenim = {
  baseUrl: 'https://weappsenim.vercel.app',
  
  async getRecent() {
    const res = await fetch(`${this.baseUrl}/api/recent`);
    return res.json();
  },
  
  async search(query) {
    const res = await fetch(`${this.baseUrl}/api/search?q=${encodeURIComponent(query)}`);
    return res.json();
  }
};

// ============================================
// 14. SENIM (ItsGloKeR)
// ============================================
export const senimApi = {
  baseUrl: 'https://senim.vercel.app',
  
  async getTrending() {
    const res = await fetch(`${this.baseUrl}/api/trending`);
    return res.json();
  },
  
  async getPopular() {
    const res = await fetch(`${this.baseUrl}/api/popular`);
    return res.json();
  }
};

// ============================================
// 15. WEBZEN (ItsGloKeR)
// ============================================
export const webzenApi = {
  baseUrl: 'https://webzen.vercel.app',
  
  async getHome() {
    const res = await fetch(`${this.baseUrl}/api/home`);
    return res.json();
  },
  
  async search(query) {
    const res = await fetch(`${this.baseUrl}/api/search?q=${encodeURIComponent(query)}`);
    return res.json();
  }
};

// ============================================
// 16. ANI-FIRE (Zeddxx)
// ============================================
export const aniFireApi = {
  baseUrl: 'https://ani-fire.vercel.app',
  
  async getTrending() {
    const res = await fetch(`${this.baseUrl}/api/trending`);
    return res.json();
  },
  
  async search(query) {
    const res = await fetch(`${this.baseUrl}/api/search?q=${encodeURIComponent(query)}`);
    return res.json();
  },
  
  async getInfo(id) {
    const res = await fetch(`${this.baseUrl}/api/info/${id}`);
    return res.json();
  }
};

// ============================================
// 17. API3 (ItsGloKeR)
// ============================================
export const api3 = {
  baseUrl: 'https://api3-itsgloker.vercel.app',
  
  async getAnime(id) {
    const res = await fetch(`${this.baseUrl}/anime/${id}`);
    return res.json();
  },
  
  async search(query) {
    const res = await fetch(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`);
    return res.json();
  }
};

// ============================================
// 18. GITS (ItsGloKeR)
// ============================================
export const gitsApi = {
  baseUrl: 'https://gits.vercel.app',
  
  async getTrending() {
    const res = await fetch(`${this.baseUrl}/api/trending`);
    return res.json();
  }
};

// ============================================
// 19. ANIME WEBSITE (ErickLimaS)
// ============================================
export const erickAnimeApi = {
  baseUrl: 'https://anime-website-api.vercel.app',
  
  async search(query) {
    const res = await fetch(`${this.baseUrl}/api/search?q=${encodeURIComponent(query)}`);
    return res.json();
  },
  
  async getInfo(id) {
    const res = await fetch(`${this.baseUrl}/api/anime/${id}`);
    return res.json();
  },
  
  async getEpisodes(id) {
    const res = await fetch(`${this.baseUrl}/api/episodes/${id}`);
    return res.json();
  }
};

// ============================================
// 20. HIANIME MAPPER (IrfanKhan66)
// ============================================
export const hiAnimeMapper = {
  baseUrl: 'https://hianime-mapper.vercel.app',
  
  async mapAnilist(anilistId) {
    const res = await fetch(`${this.baseUrl}/map/${anilistId}`);
    return res.json();
  },
  
  async getEpisodes(hiAnimeId) {
    const res = await fetch(`${this.baseUrl}/episodes/${hiAnimeId}`);
    return res.json();
  }
};

// ============================================
// 21. CONSUMET API (Official)
// ============================================
export const consumetApi = {
  baseUrl: 'https://api.consumet.org',
  
  // Anilist
  async searchAnilist(query, page = 1, perPage = 20) {
    const res = await fetch(`${this.baseUrl}/meta/anilist/${query}?page=${page}&perPage=${perPage}`);
    return res.json();
  },
  
  async getAnilistInfo(id) {
    const res = await fetch(`${this.baseUrl}/meta/anilist/info/${id}`);
    return res.json();
  },
  
  async getAnilistEpisodes(id, provider = 'gogoanime') {
    const res = await fetch(`${this.baseUrl}/meta/anilist/info/${id}?provider=${provider}`);
    return res.json();
  },
  
  async watchAnilist(episodeId, provider = 'gogoanime') {
    const res = await fetch(`${this.baseUrl}/meta/anilist/watch/${episodeId}?provider=${provider}`);
    return res.json();
  },
  
  // GogoAnime
  async searchGogo(query) {
    const res = await fetch(`${this.baseUrl}/anime/gogoanime/${query}`);
    return res.json();
  },
  
  async getGogoInfo(id) {
    const res = await fetch(`${this.baseUrl}/anime/gogoanime/info/${id}`);
    return res.json();
  },
  
  async watchGogo(episodeId) {
    const res = await fetch(`${this.baseUrl}/anime/gogoanime/watch/${episodeId}`);
    return res.json();
  },
  
  // Zoro (HiAnime)
  async searchZoro(query) {
    const res = await fetch(`${this.baseUrl}/anime/zoro/${query}`);
    return res.json();
  },
  
  async getZoroInfo(id) {
    const res = await fetch(`${this.baseUrl}/anime/zoro/info?id=${id}`);
    return res.json();
  },
  
  async watchZoro(episodeId) {
    const res = await fetch(`${this.baseUrl}/anime/zoro/watch?episodeId=${episodeId}`);
    return res.json();
  }
};

// ============================================
// 22. ANIWATCH API (ghoshRitesh12)
// ============================================
export const aniwatchApi = {
  baseUrl: 'https://aniwatch-api-dusky.vercel.app',
  
  async search(query, page = 1) {
    const res = await fetch(`${this.baseUrl}/anime/search?q=${encodeURIComponent(query)}&page=${page}`);
    return res.json();
  },
  
  async getInfo(animeId) {
    const res = await fetch(`${this.baseUrl}/anime/info?id=${animeId}`);
    return res.json();
  },
  
  async getEpisodes(animeId) {
    const res = await fetch(`${this.baseUrl}/anime/episodes/${animeId}`);
    return res.json();
  },
  
  async getServers(episodeId) {
    const res = await fetch(`${this.baseUrl}/anime/servers?episodeId=${episodeId}`);
    return res.json();
  },
  
  async getSources(episodeId, server = 'hd-1', category = 'sub') {
    const res = await fetch(`${this.baseUrl}/anime/episode-srcs?id=${episodeId}&server=${server}&category=${category}`);
    return res.json();
  },
  
  async getHomePage() {
    const res = await fetch(`${this.baseUrl}/anime/home`);
    return res.json();
  },
  
  async getTrending() {
    const res = await fetch(`${this.baseUrl}/anime/trending`);
    return res.json();
  }
};

// ============================================
// 23. HIANIME EPISODE MAPPER (shafat-96)
// ============================================
export const hiAnimeEpisodeMapper = {
  baseUrl: 'https://hianime-episode-mapper.vercel.app',
  
  async mapEpisode(anilistId, episodeNumber) {
    const res = await fetch(`${this.baseUrl}/map/${anilistId}/${episodeNumber}`);
    return res.json();
  },
  
  async getAllEpisodes(anilistId) {
    const res = await fetch(`${this.baseUrl}/episodes/${anilistId}`);
    return res.json();
  }
};

// ============================================
// 24. CORS ANYWHERE (Rob--W)
// ============================================
export const corsAnywhere = {
  baseUrl: 'https://cors-anywhere.herokuapp.com',
  
  proxyUrl(url) {
    return `${this.baseUrl}/${url}`;
  },
  
  async fetch(url, options = {}) {
    const res = await fetch(this.proxyUrl(url), {
      ...options,
      headers: {
        ...options.headers,
        'X-Requested-With': 'XMLHttpRequest'
      }
    });
    return res;
  }
};

// ============================================
// SMART API SELECTOR
// Auto-selects best API based on availability
// ============================================
export const smartApiSelector = {
  async getBestAnimeInfo(animeId, anilistId = null) {
    const apis = [
      { name: 'hianimeApi2', fn: () => hianimeApi2.info(animeId) },
      { name: 'aniwatchApi', fn: () => aniwatchApi.getInfo(animeId) },
      { name: 'consumetApi', fn: () => anilistId ? consumetApi.getAnilistInfo(anilistId) : null },
      { name: 'yahyaApi', fn: () => yahyaHiAnimeApi.info(animeId) },
      { name: 'miruroApi', fn: () => anilistId ? miruroApi.getInfo(anilistId) : null }
    ];
    
    for (const api of apis) {
      try {
        const result = await api.fn();
        if (result && !result.error) {
          console.log(`✅ Success with ${api.name}`);
          return { success: true, data: result, source: api.name };
        }
      } catch (err) {
        console.log(`❌ Failed with ${api.name}`);
      }
    }
    
    return { success: false, error: 'All APIs failed' };
  },
  
  async getBestStreamingSources(episodeId, animeId, anilistId = null) {
    const apis = [
      { name: 'hianimeApi2', fn: () => hianimeApi2.sources(episodeId) },
      { name: 'aniwatchApi', fn: () => aniwatchApi.getSources(episodeId) },
      { name: 'animeMapper', fn: () => animeMapper.getHiAnimeSources(animeId, episodeId) },
      { name: 'consumetApi', fn: () => consumetApi.watchAnilist(episodeId) },
      { name: 'yahyaApi', fn: () => yahyaHiAnimeApi.sources(episodeId) }
    ];
    
    for (const api of apis) {
      try {
        const result = await api.fn();
        if (result && result.sources && result.sources.length > 0) {
          console.log(`✅ Streaming success with ${api.name}`);
          return { success: true, data: result, source: api.name };
        }
      } catch (err) {
        console.log(`❌ Streaming failed with ${api.name}`);
      }
    }
    
    return { success: false, error: 'All streaming APIs failed' };
  }
};

// ============================================
// EXPORT ALL APIs
// ============================================
export default {
  hianimeApi2,
  miruroApi,
  animeMapper,
  m3u8ProxyMd,
  zenimeApi,
  corsWorker,
  shashankAnimeApi,
  anilistProxy,
  zemnimeWeb,
  m3u8ProxyAlperen,
  yahyaHiAnimeApi,
  hentaiApi,
  weappsenim,
  senimApi,
  webzenApi,
  aniFireApi,
  api3,
  gitsApi,
  erickAnimeApi,
  hiAnimeMapper,
  consumetApi,
  aniwatchApi,
  hiAnimeEpisodeMapper,
  corsAnywhere,
  smartApiSelector
};
