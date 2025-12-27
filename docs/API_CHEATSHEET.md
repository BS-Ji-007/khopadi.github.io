# 🚀 24 ANIME APIs - QUICK CHEATSHEET

## 💨 **INSTANT COPY-PASTE CODE**

---

## 🔥 **SMART SELECTOR (USE THIS!):**

```javascript
import { smartApiSelector } from './utils/allAnimeAPIs';

// ✅ Get Anime Info (Auto-fallback)
const info = await smartApiSelector.getBestAnimeInfo('one-piece-100', 21);

// ✅ Get Streaming Sources (Auto-fallback)
const sources = await smartApiSelector.getBestStreamingSources('ep-id', 'one-piece-100', 21);
```

---

## 🎬 **1. SEARCH ANIME:**

```javascript
// HiAnime API 2
import { hianimeApi2 } from './utils/allAnimeAPIs';
const results = await hianimeApi2.search('naruto');

// Consumet API
import { consumetApi } from './utils/allAnimeAPIs';
const results = await consumetApi.searchAnilist('naruto');

// Aniwatch API
import { aniwatchApi } from './utils/allAnimeAPIs';
const results = await aniwatchApi.search('naruto');
```

---

## 📺 **2. GET ANIME INFO:**

```javascript
// HiAnime API 2
const info = await hianimeApi2.info('naruto-20');

// Aniwatch API
const info = await aniwatchApi.getInfo('naruto-20');

// Consumet Anilist
const info = await consumetApi.getAnilistInfo(20);
```

---

## 📦 **3. GET EPISODES:**

```javascript
// HiAnime API 2
const episodes = await hianimeApi2.episodes('naruto-20');

// Aniwatch API
const episodes = await aniwatchApi.getEpisodes('naruto-20');

// Consumet
const data = await consumetApi.getAnilistInfo(20);
const episodes = data.episodes;
```

---

## ▶️ **4. GET STREAMING SOURCES:**

```javascript
// HiAnime API 2
const sources = await hianimeApi2.sources('episode-id', 'hd-1', 'sub');

// Aniwatch API
const sources = await aniwatchApi.getSources('episode-id', 'hd-1', 'sub');

// Consumet
const sources = await consumetApi.watchAnilist('episode-id', 'gogoanime');
```

---

## 🗺️ **5. MAP ANILIST TO STREAMING:**

```javascript
// Anime Mapper
import { animeMapper } from './utils/allAnimeAPIs';
const mapped = await animeMapper.mapHiAnime(21); // Anilist ID

// HiAnime Mapper
import { hiAnimeMapper } from './utils/allAnimeAPIs';
const mapped = await hiAnimeMapper.mapAnilist(21);

// Episode Mapper
import { hiAnimeEpisodeMapper } from './utils/allAnimeAPIs';
const episode = await hiAnimeEpisodeMapper.mapEpisode(21, 1120);
```

---

## 🔒 **6. PROXY M3U8 URLS:**

```javascript
// M3U8 Proxy MD
import { m3u8ProxyMd } from './utils/allAnimeAPIs';
const proxied = m3u8ProxyMd.proxyUrl('https://video.m3u8');

// M3U8 Proxy Alperen
import { m3u8ProxyAlperen } from './utils/allAnimeAPIs';
const proxied = m3u8ProxyAlperen.proxyUrl('https://video.m3u8');
```

---

## 🌐 **7. BYPASS CORS:**

```javascript
// CORS Worker
import { corsWorker } from './utils/allAnimeAPIs';
const response = await corsWorker.fetch('https://blocked-url.com');

// CORS Anywhere
import { corsAnywhere } from './utils/allAnimeAPIs';
const response = await corsAnywhere.fetch('https://blocked-url.com');
```

---

## 🔥 **8. TRENDING/POPULAR:**

```javascript
// Shashank API
import { shashankAnimeApi } from './utils/allAnimeAPIs';
const trending = await shashankAnimeApi.trending();
const popular = await shashankAnimeApi.popular();

// Aniwatch API
import { aniwatchApi } from './utils/allAnimeAPIs';
const trending = await aniwatchApi.getTrending();
const home = await aniwatchApi.getHomePage();
```

---

## 🎯 **9. ANILIST GRAPHQL:**

```javascript
import { anilistProxy } from './utils/allAnimeAPIs';

// Quick method
const anime = await anilistProxy.getAnime(21);

// Custom query
const query = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      id title { romaji }
    }
  }
`;
const result = await anilistProxy.query(query, { id: 21 });
```

---

## 📦 **10. MULTIPLE PROVIDERS (CONSUMET):**

```javascript
import { consumetApi } from './utils/allAnimeAPIs';

// GogoAnime
const gogoResults = await consumetApi.searchGogo('naruto');
const gogoInfo = await consumetApi.getGogoInfo('naruto');
const gogoWatch = await consumetApi.watchGogo('naruto-episode-1');

// Zoro (HiAnime)
const zoroResults = await consumetApi.searchZoro('naruto');
const zoroInfo = await consumetApi.getZoroInfo('naruto-20');
const zoroWatch = await consumetApi.watchZoro('naruto$episode$1');

// Anilist
const aniResults = await consumetApi.searchAnilist('naruto');
const aniInfo = await consumetApi.getAnilistInfo(20);
const aniWatch = await consumetApi.watchAnilist('ep-id', 'gogoanime');
```

---

## 💎 **ALL 24 APIs IMPORT:**

```javascript
import {
  // Primary Streaming
  hianimeApi2,          // #1 - HiAnime scraper
  aniwatchApi,          // #22 - Aniwatch scraper
  consumetApi,          // #21 - Consumet official
  miruroApi,            // #2 - Miruro API
  
  // Mapping Services
  animeMapper,          // #3 - Multi-platform mapper
  hiAnimeMapper,        // #20 - Anilist to HiAnime
  hiAnimeEpisodeMapper, // #23 - Episode mapper
  
  // Proxy Services
  m3u8ProxyMd,          // #4 - M3U8 proxy
  m3u8ProxyAlperen,     // #10 - Alt M3U8 proxy
  corsWorker,           // #6 - CORS bypass
  corsAnywhere,         // #24 - Universal CORS
  
  // Additional Sources
  zenimeApi,            // #5 - Zenime
  yahyaHiAnimeApi,      // #11 - Yahya HiAnime
  shashankAnimeApi,     // #7 - Shashank API
  erickAnimeApi,        // #19 - Erick anime
  aniFireApi,           // #16 - Ani-Fire
  
  // Anilist Integration
  anilistProxy,         // #8 - Anilist GraphQL
  
  // Utility APIs
  zemnimeWeb,           // #9 - Zemnime web
  weappsenim,           // #13 - Weappsenim
  senimApi,             // #14 - Senim
  webzenApi,            // #15 - WebZen
  api3,                 // #17 - API3
  gitsApi,              // #18 - Gits
  hentaiApi,            // #12 - Hentai (adult)
  
  // Smart Selector (RECOMMENDED!)
  smartApiSelector      // Auto-fallback system
} from './utils/allAnimeAPIs';
```

---

## ⚡ **COMPLETE EXAMPLE:**

```javascript
import { smartApiSelector, m3u8ProxyMd } from './utils/allAnimeAPIs';

// 1. Get anime info
const info = await smartApiSelector.getBestAnimeInfo('one-piece-100', 21);

if (info.success) {
  console.log('Title:', info.data.title);
  console.log('Episodes:', info.data.episodes);
  
  // 2. Get streaming sources
  const sources = await smartApiSelector.getBestStreamingSources(
    'episode-id',
    'one-piece-100',
    21
  );
  
  if (sources.success) {
    // 3. Proxy the M3U8 URL
    const videoUrl = sources.data.sources[0].url;
    const proxiedUrl = m3u8ProxyMd.proxyUrl(videoUrl);
    
    console.log('Proxied URL:', proxiedUrl);
    
    // 4. Use in video player
    videoElement.src = proxiedUrl;
  }
}
```

---

## 🏆 **BEST API FOR EACH TASK:**

| Task | Best API | Alternative |
|------|----------|-------------|
| Search | `hianimeApi2` | `aniwatchApi` |
| Info | `smartApiSelector` | `hianimeApi2` |
| Episodes | `hianimeApi2` | `aniwatchApi` |
| Streaming | `smartApiSelector` | `hianimeApi2` |
| Mapping | `animeMapper` | `hiAnimeMapper` |
| M3U8 Proxy | `m3u8ProxyMd` | `m3u8ProxyAlperen` |
| CORS Bypass | `corsWorker` | `corsAnywhere` |
| Trending | `aniwatchApi` | `shashankAnimeApi` |
| Anilist Data | `anilistProxy` | `consumetApi` |

---

## 🛡️ **ERROR HANDLING:**

```javascript
try {
  const sources = await hianimeApi2.sources('episode-id');
} catch (error) {
  // Fallback to alternative
  try {
    const sources = await aniwatchApi.getSources('episode-id');
  } catch (error2) {
    // Final fallback
    const sources = await consumetApi.watchAnilist('episode-id');
  }
}
```

---

## 📊 **API RESPONSE FORMATS:**

### Search Response:
```json
{
  "results": [
    {
      "id": "anime-id",
      "title": "Anime Title",
      "image": "poster-url",
      "type": "TV"
    }
  ]
}
```

### Info Response:
```json
{
  "id": "anime-id",
  "title": "Anime Title",
  "episodes": [{"number": 1, "id": "ep-id"}],
  "genres": ["Action", "Adventure"]
}
```

### Sources Response:
```json
{
  "sources": [
    {
      "url": "video-url.m3u8",
      "quality": "1080p",
      "isM3U8": true
    }
  ],
  "subtitles": [{"url": "sub.vtt", "lang": "English"}]
}
```

---

## 🎉 **READY TO USE!**

**Copy karo aur paste karo! All 24 APIs ready hain! 🚀**

**Total: 24 APIs | Smart Selector: Auto-Fallback | Proxies: Included | CORS: Bypassed**

**SAB KUCH PERFECT HAI BOSS! 🔥💯**
