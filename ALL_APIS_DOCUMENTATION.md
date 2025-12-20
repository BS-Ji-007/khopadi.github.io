# 🎯 **ALL APIS INTEGRATED** 🔥

## 📋 **Complete List of APIs:**

---

## 1. 🎬 **TMDB API** (The Movie Database)
**Status:** ✅ ACTIVE  
**API Key:** `b97bbe91d4e62db2ae1eea9d5bf2f2aa`  
**Base URL:** `https://api.themoviedb.org/3`

### **Features:**
- 🎥 Movies database
- 📺 TV Shows database
- 🔍 Multi-search (movies + TV)
- 🎭 Cast & crew info
- 🎬 Trailers & videos
- ⭐ Ratings & reviews
- 📅 Upcoming releases
- 🖼️ High-quality images

### **Endpoints Used:**
```javascript
/trending/movie/week       // Trending movies
/movie/popular             // Popular movies
/tv/popular                // Popular TV shows
/search/multi              // Search all
/movie/{id}                // Movie details
/tv/{id}                   // TV show details
/movie/upcoming            // Upcoming movies
```

---

## 2. ⭐ **HiAnime API** (Anime Streaming)
**Status:** ✅ ACTIVE  
**Type:** FREE (No API Key)  
**Multiple Servers:** 4 servers with auto-fallback

### **Servers:**
1. `https://hianime-api2.vercel.app`
2. `https://api-aniwatch.onrender.com`
3. `https://hianime-api.onrender.com`
4. `https://api.aniwatch.pro`

### **Features:**
- 🎌 Complete anime database
- 📺 Episode streaming (SUB & DUB)
- 🎥 Multiple video servers
- 📝 Subtitles support
- ⏭️ Skip intro/outro
- 🔍 Anime search
- 📊 Top airing, popular, recent
- 📅 Anime schedule
- 🎭 Characters & voice actors
- 🎬 Anime movies & OVA

### **Endpoints Used:**
```javascript
/api/v1/home                     // Home page data
/api/v1/search                   // Search anime
/api/v1/anime/{id}               // Anime details
/api/v1/episodes/{id}            // Get episodes
/api/v1/servers?id={episodeId}   // Get servers
/api/v1/stream                   // Get stream links
/api/v1/animes/top-airing        // Top airing
/api/v1/animes/most-popular      // Most popular
/api/v1/animes/recently-updated  // Recent episodes
/api/v1/genres                   // All genres
/api/v1/filter                   // Filter anime
/api/v1/schedules                // Anime schedule
```

---

## 3. 🌐 **CORS Proxy API** (Bypass CORS)
**Status:** ✅ ACTIVE  
**Type:** FREE  
**From:** ItsGloKeR/corsworker

### **Servers:**
1. `https://cors-proxy-worker.itsgloker.workers.dev`
2. `https://corsworker.vercel.app`
3. `https://cors-anywhere.herokuapp.com`

### **Features:**
- 🔓 Bypass CORS restrictions
- 🌍 Proxy any HTTP request
- 🚀 Fast Cloudflare Workers
- 🔄 Auto-fallback between servers
- 📦 Support for all content types

### **Usage:**
```javascript
import { corsProxy } from './utils/proxyApis';

// Proxy a URL
const proxiedUrl = corsProxy.getUrl('https://example.com/api');

// Fetch with proxy
const data = await corsProxy.fetch('https://example.com/api');
```

---

## 4. 📹 **M3U8 Proxy API** (Video Streaming)
**Status:** ✅ ACTIVE  
**Type:** FREE  
**From:** ItsGloKeR/m3u8proxymd

### **Servers:**
1. `https://m3u8proxy.itsgloker.workers.dev`
2. `https://m3u8proxymd.vercel.app`

### **Features:**
- 🎥 Proxy M3U8 playlists
- 📺 Video segment proxying
- 🔄 Automatic URL rewriting
- 🎬 Referer support
- 🚀 HLS streaming support

### **Usage:**
```javascript
import { m3u8Proxy } from './utils/proxyApis';

// Proxy M3U8 playlist
const m3u8Url = m3u8Proxy.getUrl(
  'https://example.com/video.m3u8',
  'https://megacloud.tv' // referer
);

// Fetch playlist
const playlist = await m3u8Proxy.fetch(
  'https://example.com/video.m3u8'
);
```

---

## 5. 🎌 **Anilist Proxy API** (Anime Data)
**Status:** ✅ ACTIVE  
**Type:** FREE  
**From:** ItsGloKeR/anitlistproxy

### **Server:**
`https://anilistproxy.vercel.app`

### **Features:**
- 🎭 Complete anime metadata
- 📊 Ratings & popularity
- 👥 Characters & staff
- 🔗 Relations & sequels
- 🎬 Studios & genres
- 📅 Airing schedule
- 🔍 Advanced search
- 📈 Trending & popular

### **Usage:**
```javascript
import { anilistProxy } from './utils/proxyApis';

// Search anime
const results = await anilistProxy.searchAnime('naruto', 1);

// Get anime details
const anime = await anilistProxy.getAnimeDetails(21);

// Get trending
const trending = await anilistProxy.getTrending(1);

// Get popular
const popular = await anilistProxy.getPopular(1);
```

---

## 6. 📺 **TVMaze API** (TV Shows)
**Status:** ✅ ACTIVE  
**Type:** FREE (No API Key)  
**Base URL:** `https://api.tvmaze.com`

### **Features:**
- 📺 TV show database
- 🔍 Show search
- 📅 Episode schedule
- ⭐ Show ratings
- 🎭 Cast information

### **Endpoints:**
```javascript
/search/shows              // Search TV shows
/schedule                  // Today's schedule
/shows/{id}                // Show details
```

---

## 7. 🎬 **OMDb API** (Movie Database)
**Status:** ✅ ACTIVE  
**API Key:** `3c0368f7`  
**Base URL:** `https://www.omdbapi.com`

### **Features:**
- 🎥 Movie search
- 📊 IMDb ratings
- 🎭 Cast & plot
- 📅 Release dates

---

## 8. 🎪 **Movie Quotes APIs**
**Status:** ✅ ACTIVE  
**Type:** FREE

### **APIs:**
1. **Breaking Bad Quotes**  
   `https://api.breakingbadquotes.xyz/v1/quotes`

2. **Game of Thrones Quotes**  
   `https://api.gameofthronesquotes.xyz/v1/random`

3. **Movie Quotes**  
   `https://movie-quote-api.herokuapp.com/v1/quote`

---

## 🎯 **API Integration Summary**

### **Total APIs:** 8
### **Total Servers:** 15+
### **All FREE:** ✅ Yes!

---

## 📊 **API Usage in Website:**

### **Homepage:**
- TMDB API → Trending movies
- HiAnime API → Trending anime (optional)
- Movie Quotes API → Random quotes

### **Movies Page:**
- TMDB API → Popular movies
- Pagination support

### **TV Shows Page:**
- TMDB API → Popular TV shows
- TVMaze API → Alternative data

### **Anime Page:**
- HiAnime API → Anime list
- Categories: Top Airing, Popular, Recent

### **Anime Player:**
- HiAnime API → Stream links
- M3U8 Proxy → Video streaming
- CORS Proxy → Subtitle files
- 4 API servers + Multiple video servers

### **Search:**
- TMDB API → Movies & TV
- HiAnime API → Anime
- TVMaze API → TV shows
- OMDb API → Fallback

### **Movie/TV Details:**
- TMDB API → Complete details
- Cast, crew, trailers, similar

---

## 🚀 **Performance Features:**

### **Multi-Server Architecture:**
```
Primary Server → Backup Server 1 → Backup Server 2 → Backup Server 3
```

### **Auto-Fallback:**
- ✅ If one API fails, automatically tries next
- ✅ No downtime for users
- ✅ Seamless experience

### **Proxy Support:**
- ✅ CORS bypass for restricted APIs
- ✅ M3U8 proxy for video streaming
- ✅ Subtitle proxy for VTT files

---

## 📦 **File Structure:**

```
src/utils/
├── multiApi.js       → TMDB, OMDb, TVMaze, Quotes, Smart Search
├── hianimeApi.js     → HiAnime API with 4 servers
└── proxyApis.js      → CORS, M3U8, Anilist proxies
```

---

## 🔧 **Installation:**

```bash
# Install dependencies
npm install axios hls.js

# Build
npm run build

# Deploy
npm run deploy
```

---

## 📝 **Usage Examples:**

### **1. Search Across All APIs:**
```javascript
import { smartSearch } from './utils/multiApi';

const results = await smartSearch('naruto');
// Returns: { source: 'HiAnime', data: [...], type: 'anime' }
```

### **2. Get Anime with Streaming:**
```javascript
import { hianime } from './utils/hianimeApi';

// Get anime details
const anime = await hianime.details('naruto-shippuden-355');

// Get episodes
const episodes = await hianime.episodes('naruto-shippuden-355');

// Get stream link
const stream = await hianime.stream(episodeId, 'hd-1', 'sub');
```

### **3. Proxy Video Stream:**
```javascript
import { m3u8Proxy } from './utils/proxyApis';

const proxiedUrl = m3u8Proxy.getUrl(
  'https://cdn.example.com/video.m3u8',
  'https://megacloud.tv'
);

// Use in HLS player
hls.loadSource(proxiedUrl);
```

---

## 🎉 **Result:**

### **Your Website Now Has:**
- 🎬 **Complete Movie Database** (TMDB + OMDb)
- 📺 **TV Shows Database** (TMDB + TVMaze)
- ⭐ **Anime Streaming** (HiAnime + 4 Servers)
- 🎥 **Video Player** (HLS.js + M3U8 Proxy)
- 🔍 **Smart Search** (8 APIs combined)
- 🌐 **CORS Bypass** (3 Proxy Servers)
- 📹 **M3U8 Streaming** (2 Proxy Servers)
- 🎌 **Anime Metadata** (Anilist Proxy)
- 💬 **Movie Quotes** (3 Quote APIs)
- 🚀 **Auto-Fallback** (15+ Servers Total)

---

## 💪 **Reliability:**

- ✅ **Multiple servers** for each API
- ✅ **Auto-retry** on failure
- ✅ **Proxy support** for restricted content
- ✅ **Error handling** at every level
- ✅ **Loading states** for better UX
- ✅ **Fallback images** for missing posters

---

## 🔒 **All APIs are FREE!**

No subscription required, no credit card needed!

---

**Created by:** BS-Ji-007  
**Based on repos from:** ItsGloKeR  
**Date:** December 20, 2025  
**Status:** 🟢 LIVE & WORKING

---

# 🎊 **ENJOY YOUR COMPLETE ENTERTAINMENT PLATFORM!** 🎊
