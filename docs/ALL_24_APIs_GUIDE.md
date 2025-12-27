# 🎯 ALL 24 ANIME APIs - COMPLETE GUIDE

## 📊 **Total APIs Integrated: 24**

Yahan tumhare project mein **24 powerful anime APIs** integrate kiye gaye hain!

---

## 📋 **Complete API List:**

### **🎬 Primary Streaming APIs (1-11):**

1. ✅ **HiAnime API 2** (ItsGloKeR) - Main HiAnime scraper
2. ✅ **Miruro API** - Consumet-based anime streaming
3. ✅ **Anime Mapper** (shafat-96) - Maps Anilist to multiple sources
4. ✅ **M3U8 Proxy MD** (ItsGloKeR) - M3U8 proxy service
5. ✅ **Zenime API** (itzzzme) - Alternative anime source
6. ✅ **CORS Worker** (ItsGloKeR) - CORS bypass
7. ✅ **Anime API** (ShashankBhake) - Trending & popular anime
8. ✅ **Anilist Proxy** (ItsGloKeR) - Direct Anilist GraphQL
9. ✅ **Zemnime Web** (ItsGloKeR) - Web interface API
10. ✅ **M3U8 Proxy** (AlperenBayam) - Alternative M3U8 proxy
11. ✅ **HiAnime API** (yahyaMomin) - Another HiAnime source

### **🔥 Additional Sources (12-18):**

12. ✅ **Hentai API** (shimizudev) - Adult anime content
13. ✅ **WeappsEnim** (ItsGloKeR) - Web app API
14. ✅ **Senim** (ItsGloKeR) - Trending service
15. ✅ **WebZen** (ItsGloKeR) - Alternative web source
16. ✅ **Ani-Fire** (Zeddxx) - Fire anime API
17. ✅ **API3** (ItsGloKeR) - Third generation API
18. ✅ **Gits** (ItsGloKeR) - Git-based anime service

### **⚡ Advanced APIs (19-24):**

19. ✅ **Anime Website** (ErickLimaS) - Full-featured anime site API
20. ✅ **HiAnime Mapper** (IrfanKhan66) - Anilist to HiAnime mapper
21. ✅ **Consumet API** (Official) - Official Consumet service
22. ✅ **Aniwatch API** (ghoshRitesh12) - Complete Aniwatch scraper
23. ✅ **HiAnime Episode Mapper** (shafat-96) - Episode mapping service
24. ✅ **CORS Anywhere** (Rob--W) - Universal CORS proxy

---

## 🚀 **Quick Start Usage:**

### **Import APIs:**

```javascript
import {
  hianimeApi2,
  miruroApi,
  animeMapper,
  consumetApi,
  aniwatchApi,
  smartApiSelector
} from '../utils/allAnimeAPIs';
```

---

## 💡 **Usage Examples:**

### **1. Search Anime (Multiple Sources):**

```javascript
// HiAnime API 2
const results1 = await hianimeApi2.search('one piece');

// Consumet API
const results2 = await consumetApi.searchAnilist('naruto');

// Aniwatch API
const results3 = await aniwatchApi.search('demon slayer');

// Miruro API (Anilist)
const results4 = await miruroApi.searchAnilist('attack on titan');
```

### **2. Get Anime Info:**

```javascript
// Using Smart Selector (tries all APIs)
const info = await smartApiSelector.getBestAnimeInfo(
  'one-piece-100',
  21 // Anilist ID
);

if (info.success) {
  console.log('Got info from:', info.source);
  console.log('Data:', info.data);
}

// Or use specific API
const info2 = await hianimeApi2.info('one-piece-100');
const info3 = await aniwatchApi.getInfo('one-piece-100');
```

### **3. Get Episodes:**

```javascript
// HiAnime API 2
const episodes1 = await hianimeApi2.episodes('one-piece-100');

// Consumet API
const episodes2 = await consumetApi.getAnilistEpisodes(21, 'gogoanime');

// Aniwatch API
const episodes3 = await aniwatchApi.getEpisodes('one-piece-100');
```

### **4. Get Streaming Sources:**

```javascript
// Using Smart Selector (tries all)
const sources = await smartApiSelector.getBestStreamingSources(
  'episode-id',
  'one-piece-100',
  21
);

if (sources.success) {
  console.log('Got sources from:', sources.source);
  console.log('Quality options:', sources.data.sources);
}

// HiAnime API 2
const src1 = await hianimeApi2.sources('episode-id', 'hd-1', 'sub');

// Aniwatch API
const src2 = await aniwatchApi.getSources('episode-id', 'hd-1', 'sub');

// Anime Mapper
const src3 = await animeMapper.getHiAnimeSources(
  'one-piece-100',
  1120,
  'vidstreaming',
  'sub'
);
```

### **5. Map Anilist ID to Streaming:**

```javascript
// Anime Mapper
const mapped1 = await animeMapper.mapHiAnime(21); // One Piece
const mapped2 = await animeMapper.mapAnimePahe(21);
const mapped3 = await animeMapper.mapAnimeKai(21);

// HiAnime Mapper
const mapped4 = await hiAnimeMapper.mapAnilist(21);

// HiAnime Episode Mapper
const episode = await hiAnimeEpisodeMapper.mapEpisode(21, 1120);
```

### **6. Use Proxies for M3U8:**

```javascript
// M3U8 Proxy MD
const proxiedUrl1 = m3u8ProxyMd.proxyUrl('https://example.com/video.m3u8');
const content1 = await m3u8ProxyMd.fetchWithProxy('https://example.com/video.m3u8');

// M3U8 Proxy Alperen
const proxiedUrl2 = m3u8ProxyAlperen.proxyUrl('https://example.com/video.m3u8');
const content2 = await m3u8ProxyAlperen.fetchM3U8('https://example.com/video.m3u8');
```

### **7. Bypass CORS:**

```javascript
// CORS Worker
const response1 = await corsWorker.fetch('https://blocked-site.com/api');

// CORS Anywhere
const response2 = await corsAnywhere.fetch('https://blocked-site.com/api');
```

### **8. Anilist GraphQL Queries:**

```javascript
const query = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title { romaji english native }
      coverImage { large }
      episodes
      genres
    }
  }
`;

const result = await anilistProxy.query(query, { id: 21 });
// Or use helper
const anime = await anilistProxy.getAnime(21);
```

### **9. Get Trending/Popular:**

```javascript
// Shashank API
const trending1 = await shashankAnimeApi.trending();
const popular1 = await shashankAnimeApi.popular();

// Aniwatch API
const trending2 = await aniwatchApi.getTrending();
const home = await aniwatchApi.getHomePage();

// Senim API
const trending3 = await senimApi.getTrending();
const popular2 = await senimApi.getPopular();

// Ani-Fire
const trending4 = await aniFireApi.getTrending();
```

### **10. Multiple Provider Search:**

```javascript
// Consumet API - Multiple Providers
const gogoResults = await consumetApi.searchGogo('one piece');
const zoroResults = await consumetApi.searchZoro('one piece');
const anilistResults = await consumetApi.searchAnilist('one piece');

// Get Info from Different Providers
const gogoInfo = await consumetApi.getGogoInfo('one-piece');
const zoroInfo = await consumetApi.getZoroInfo('one-piece-100');
const anilistInfo = await consumetApi.getAnilistInfo(21);

// Watch from Different Providers
const gogoSources = await consumetApi.watchGogo('one-piece-episode-1');
const zoroSources = await consumetApi.watchZoro('one-piece-100$episode$1');
const anilistSources = await consumetApi.watchAnilist('episode-id', 'gogoanime');
```

---

## 🎯 **Smart API Selector (Recommended):**

Ye automatically best working API choose karta hai:

```javascript
import { smartApiSelector } from '../utils/allAnimeAPIs';

// Get anime info (tries all APIs)
const info = await smartApiSelector.getBestAnimeInfo(
  'one-piece-100',
  21 // Optional Anilist ID
);

if (info.success) {
  console.log('Working API:', info.source);
  console.log('Data:', info.data);
} else {
  console.log('All APIs failed');
}

// Get streaming sources (tries all APIs)
const sources = await smartApiSelector.getBestStreamingSources(
  'episode-id',
  'one-piece-100',
  21 // Optional Anilist ID
);

if (sources.success) {
  console.log('Streaming from:', sources.source);
  console.log('Sources:', sources.data.sources);
}
```

---

## 📚 **API Categories:**

### **Category 1: Primary Streaming**
- hianimeApi2
- aniwatchApi
- consumetApi
- miruroApi

### **Category 2: Mapping Services**
- animeMapper
- hiAnimeMapper
- hiAnimeEpisodeMapper

### **Category 3: Proxy Services**
- m3u8ProxyMd
- m3u8ProxyAlperen
- corsWorker
- corsAnywhere

### **Category 4: Additional Sources**
- zenimeApi
- yahyaHiAnimeApi
- shashankAnimeApi
- erickAnimeApi
- aniFireApi

### **Category 5: Anilist Integration**
- anilistProxy
- consumetApi (Anilist meta)
- miruroApi (Anilist)

### **Category 6: Utility APIs**
- zemnimeWeb
- weappsenim
- senimApi
- webzenApi
- api3
- gitsApi

---

## 🔥 **Best Practices:**

### **1. Always Use Smart Selector First:**
```javascript
const result = await smartApiSelector.getBestAnimeInfo(animeId, anilistId);
```

### **2. Fallback Chain:**
```javascript
let sources;
try {
  sources = await hianimeApi2.sources(episodeId);
} catch {
  try {
    sources = await aniwatchApi.getSources(episodeId);
  } catch {
    sources = await consumetApi.watchAnilist(episodeId);
  }
}
```

### **3. Use Proxies for Blocked Content:**
```javascript
const videoUrl = sources.sources[0].url;
const proxiedUrl = m3u8ProxyMd.proxyUrl(videoUrl);
```

### **4. Cache API Responses:**
```javascript
const cacheKey = `anime_${animeId}`;
let data = localStorage.getItem(cacheKey);

if (!data) {
  data = await hianimeApi2.info(animeId);
  localStorage.setItem(cacheKey, JSON.stringify(data));
}
```

---

## 🎊 **Complete Integration Summary:**

✅ **24 APIs** - All integrated
✅ **Smart Selector** - Auto-fallback system
✅ **Multiple Sources** - HiAnime, Consumet, GogoAnime, etc.
✅ **Mapping Services** - Anilist to streaming platforms
✅ **Proxy Services** - M3U8 & CORS proxies
✅ **Error Handling** - Automatic fallbacks
✅ **Type Support** - Sub, Dub, Raw
✅ **Quality Options** - 360p to 1080p

---

## 📖 **Repository Links:**

1. [hianime-api2](https://github.com/ItsGloKeR/hianime-api2)
2. [Miruro](https://github.com/Miruro-no-kuon/Miruro)
3. [anime-mapper](https://github.com/shafat-96/anime-mapper)
4. [m3u8proxymd](https://github.com/ItsGloKeR/m3u8proxymd)
5. [zenime](https://github.com/itzzzme/zenime)
6. [corsworker](https://github.com/ItsGloKeR/corsworker)
7. [anime-api](https://github.com/ShashankBhake/anime-api)
8. [anitlistproxy](https://github.com/ItsGloKeR/anitlistproxy)
9. [zemnimeweb](https://github.com/ItsGloKeR/zemnimeweb)
10. [m3u8-proxy](https://github.com/AlperenBayam/m3u8-proxy)
11. [hianime-API](https://github.com/yahyaMomin/hianime-API)
12. [hentai-api](https://github.com/shimizudev/hentai-api)
13. [weappsenim](https://github.com/ItsGloKeR/weappsenim)
14. [senim](https://github.com/ItsGloKeR/senim)
15. [WebZen](https://github.com/ItsGloKeR/WebZen)
16. [ani-fire](https://github.com/Zeddxx/ani-fire)
17. [api3](https://github.com/ItsGloKeR/api3)
18. [gits](https://github.com/ItsGloKeR/gits)
19. [anime-website](https://github.com/ErickLimaS/anime-website)
20. [hianime-mapper](https://github.com/IrfanKhan66/hianime-mapper)
21. [api.consumet.org](https://github.com/consumet/api.consumet.org)
22. [aniwatch-api](https://github.com/ghoshRitesh12/aniwatch-api)
23. [hianime-episode-mapper](https://github.com/shafat-96/hianime-episode-mapper)
24. [cors-anywhere](https://github.com/Rob--W/cors-anywhere)

---

## 🎯 **Final Note:**

**Bhai, ab tumhare paas 24 powerful APIs hain!** 🔥

Smart selector automatically best API choose karega. Agar ek fail ho, to dusra try karega. **Complete fallback system hai!**

**SAB KUCH READY HAI! ENJOY UNLIMITED ANIME STREAMING! 🎉**
