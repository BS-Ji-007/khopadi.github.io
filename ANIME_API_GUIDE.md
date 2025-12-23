# 🎌 KHOPADI Anime API Integration Guide

## 📚 Table of Contents

- [Overview](#overview)
- [API Sources](#api-sources)
- [Installation](#installation)
- [Usage Examples](#usage-examples)
- [API Features](#api-features)
- [Streaming Guide](#streaming-guide)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

KHOPADI now has a **comprehensive anime streaming system** with multiple API sources, automatic fallback, and advanced streaming capabilities.

### ✨ Features

- 🔄 **Multiple API Sources** - HiAnime, Consumet, Anime Mapper
- 🎭 **Sub & Dub Support** - Both Japanese and English audio
- 📺 **HD Streaming** - Up to 1080p quality
- 🔐 **CORS Bypass** - Built-in proxy system
- 📱 **HLS Playback** - Adaptive quality streaming
- 🎬 **Episode Tracking** - Intro/Outro skip support
- 🌐 **Anilist Integration** - MAL ID mapping

---

## 🔌 API Sources

### 1. **HiAnime API** (Primary)
```javascript
import { hianimeApi } from './utils/advancedAnimeApi';

// Search anime
const results = await hianimeApi.search('naruto', 1);

// Get anime info
const anime = await hianimeApi.info('naruto-677');

// Get episodes
const episodes = await hianimeApi.episodes('naruto-677');

// Get streaming sources
const sources = await hianimeApi.sources('episodeId', 'hd-1', 'sub');
```

**Features:**
- ✅ Comprehensive anime database
- ✅ Advanced filtering
- ✅ Schedule support
- ✅ Character info
- ✅ Multiple servers (HD-1, HD-2, etc.)
- ✅ Sub/Dub support
- ✅ Intro/Outro markers

---

### 2. **Anime Mapper** (Anilist Integration)
```javascript
import { animeMapper } from './utils/advancedAnimeApi';

// Map Anilist ID to HiAnime
const hianime = await animeMapper.mapToHiAnime(21); // Death Note

// Map to AnimePahe
const animepahe = await animeMapper.mapToAnimePahe(21);

// Map to AnimeKai
const animekai = await animeMapper.mapToAnimeKai(21);

// Get episode sources
const sources = await animeMapper.getHiAnimeSources(
  'one-piece-100',
  1120, // episode number
  'hd-1',
  'sub'
);
```

**Features:**
- ✅ Anilist ID → Platform mapping
- ✅ Multi-platform support
- ✅ Episode tracking
- ✅ Sub/Dub detection

---

### 3. **Consumet API** (Fallback)
```javascript
import { consumetApi } from './utils/advancedAnimeApi';

// Search multiple sources
const results = await consumetApi.searchMulti('one piece');
// Returns: { gogoanime: [...], zoro: [...], animepahe: [...] }

// Get GoGoAnime info
const info = await consumetApi.gogoInfo('anime-id');

// Get watch links
const watch = await consumetApi.gogoWatch('episode-id');
```

**Features:**
- ✅ Multiple anime sources
- ✅ GoGoAnime integration
- ✅ Zoro integration
- ✅ AnimePahe integration

---

### 4. **Smart Anime API** (Auto-Fallback)
```javascript
import { smartAnimeApi } from './utils/advancedAnimeApi';

// Smart search (tries all sources)
const results = await smartAnimeApi.search('demon slayer', 1);

// Get anime with all sources
const anime = await smartAnimeApi.getAnime('anime-id', 21);

// Get best streaming source
const stream = await smartAnimeApi.getStreamingSources(
  'episode-id',
  'hd-1',
  'sub'
);
```

**Features:**
- ✅ Automatic API selection
- ✅ Fallback on failure
- ✅ Best quality selection
- ✅ Error handling

---

## 📦 Installation

### HLS.js (Required for streaming)

Add to your `public/index.html`:

```html
<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
```

Or install via npm:

```bash
npm install hls.js
```

---

## 💻 Usage Examples

### Example 1: Search & Display Anime

```javascript
import { smartAnimeApi } from './utils/advancedAnimeApi';

const SearchAnime = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query) => {
    setLoading(true);
    const data = await smartAnimeApi.search(query, 1);
    setResults(data.data);
    setLoading(false);
  };

  return (
    <div>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {loading ? <p>Loading...</p> : (
        results.map(anime => (
          <div key={anime.id}>
            <img src={anime.poster} alt={anime.title} />
            <h3>{anime.title}</h3>
            <p>Episodes: {anime.episodes?.eps || 'N/A'}</p>
          </div>
        ))
      )}
    </div>
  );
};
```

---

### Example 2: Video Player with Proxy

```javascript
import { setupHlsPlayer, proxifyM3U8 } from './utils/streamProxy';
import { useEffect, useRef } from 'react';

const VideoPlayer = ({ m3u8Url }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && m3u8Url) {
      hlsRef.current = setupHlsPlayer(videoRef.current, m3u8Url, {
        referer: 'https://megacloud.tv',
        autoplay: true,
        onQualityChange: (levels) => {
          console.log('Available qualities:', levels);
        }
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [m3u8Url]);

  return (
    <video
      ref={videoRef}
      controls
      className="w-full h-full"
    />
  );
};
```

---

### Example 3: Episode Player with Skip Intro

```javascript
import { hianimeApi } from './utils/advancedAnimeApi';
import { setupHlsPlayer } from './utils/streamProxy';

const EpisodePlayer = ({ animeId, episodeNumber }) => {
  const [streamData, setStreamData] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const loadEpisode = async () => {
      // Get episodes list
      const episodesData = await hianimeApi.episodes(animeId);
      const episode = episodesData.episodes.find(ep => ep.episodeNumber === episodeNumber);
      
      if (episode) {
        // Get streaming sources
        const sources = await hianimeApi.sources(episode.id, 'hd-1', 'sub');
        setStreamData(sources);
        
        // Setup player
        if (videoRef.current && sources.link) {
          setupHlsPlayer(videoRef.current, sources.link.file, {
            autoplay: true
          });
        }
      }
    };

    loadEpisode();
  }, [animeId, episodeNumber]);

  const skipIntro = () => {
    if (videoRef.current && streamData?.intro) {
      videoRef.current.currentTime = streamData.intro.end;
    }
  };

  const skipOutro = () => {
    if (videoRef.current && streamData?.outro) {
      videoRef.current.currentTime = streamData.outro.end;
    }
  };

  return (
    <div className="player-container">
      <video ref={videoRef} controls className="w-full" />
      
      {streamData?.intro && (
        <button onClick={skipIntro} className="skip-intro-btn">
          Skip Intro →
        </button>
      )}
      
      {streamData?.outro && (
        <button onClick={skipOutro} className="skip-outro-btn">
          Skip Outro →
        </button>
      )}

      {/* Subtitles */}
      {streamData?.tracks?.map((track, i) => (
        track.kind === 'captions' && (
          <track
            key={i}
            kind="subtitles"
            src={track.file}
            label={track.label}
            default={track.default}
          />
        )
      ))}
    </div>
  );
};
```

---

### Example 4: Trending Anime Page

```javascript
import { hianimeApi } from './utils/advancedAnimeApi';

const TrendingPage = () => {
  const [trending, setTrending] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadTrending = async () => {
      const data = await hianimeApi.trending(page);
      setTrending(data.animes);
    };

    loadTrending();
  }, [page]);

  return (
    <div>
      <h1>🔥 Trending Anime</h1>
      <div className="grid grid-cols-5 gap-4">
        {trending.map(anime => (
          <AnimeCard key={anime.id} anime={anime} />
        ))}
      </div>
      
      <div className="pagination">
        <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};
```

---

## 🎬 API Features

### HiAnime API Features

| Feature | Endpoint | Description |
|---------|----------|-------------|
| **Home Page** | `/home` | Spotlight, trending, top airing |
| **Search** | `/search?keyword=query` | Search anime with pagination |
| **Anime Info** | `/anime/:id` | Full anime details |
| **Episodes** | `/episodes/:id` | Episode list |
| **Servers** | `/servers?id=episodeId` | Available servers |
| **Stream** | `/stream?id=episodeId` | Streaming sources |
| **Filter** | `/filter?params` | Advanced filtering |
| **Schedule** | `/schedules` | 7-day schedule |
| **Trending** | `/animes/top-airing` | Top airing anime |
| **Popular** | `/animes/most-popular` | Most popular |
| **Genre** | `/animes/genre/:genre` | By genre |
| **Random** | `/random` | Random anime |

---

## 📺 Streaming Guide

### Quality Options

```javascript
import { changeQuality, getQualityLevels } from './utils/streamProxy';

// Get available qualities
const qualities = getQualityLevels(hlsInstance);
console.log(qualities);
// Output: [{ index: 0, label: '1080p', height: 1080 }, ...]

// Change quality
changeQuality(hlsInstance, 0); // Switch to quality index 0
```

### Download Video

```javascript
import { downloadVideo } from './utils/streamProxy';

// Download video file
downloadVideo(videoUrl, 'one-piece-ep-1120.mp4');
```

### CORS Bypass

```javascript
import { proxifyUrl, fetchWithCors } from './utils/streamProxy';

// Proxy a URL
const proxiedUrl = proxifyUrl('https://restricted-api.com/video.mp4');

// Fetch with automatic CORS bypass
const data = await fetchWithCors('https://restricted-api.com/data');
```

---

## 🔧 Troubleshooting

### Issue: "CORS Error"

**Solution:**
```javascript
import { proxifyUrl } from './utils/streamProxy';

const url = proxifyUrl(originalUrl);
```

---

### Issue: "Video Not Playing"

**Solution:**
1. Check if HLS.js is loaded
2. Verify M3U8 URL is proxied
3. Check browser console for errors

```javascript
import { setupHlsPlayer, isM3U8 } from './utils/streamProxy';

if (isM3U8(url)) {
  setupHlsPlayer(videoRef.current, url);
} else {
  videoRef.current.src = url;
}
```

---

### Issue: "Episode Not Found"

**Solution:**
Use smart API with fallback:

```javascript
const sources = await smartAnimeApi.getStreamingSources(episodeId);
if (!sources.success) {
  // Try alternative source
  const altSources = await animeMapper.getHiAnimeSources(...);
}
```

---

## 📝 Best Practices

### 1. **Error Handling**

```javascript
try {
  const data = await smartAnimeApi.search(query);
  if (data.source === 'error' || data.data.length === 0) {
    // Show error message
  }
} catch (error) {
  console.error('Search failed:', error);
}
```

### 2. **Loading States**

```javascript
const [loading, setLoading] = useState(false);

const loadData = async () => {
  setLoading(true);
  const data = await hianimeApi.search(query);
  setLoading(false);
};
```

### 3. **Caching**

```javascript
// Cache anime data
const CACHE_KEY = 'anime_' + animeId;
const cached = localStorage.getItem(CACHE_KEY);

if (cached) {
  return JSON.parse(cached);
} else {
  const data = await hianimeApi.info(animeId);
  localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  return data;
}
```

---

## 🎉 Summary

### What We Added:

✅ **HiAnime API** - Complete anime database  
✅ **Anime Mapper** - Anilist integration  
✅ **Consumet API** - Multiple sources  
✅ **Smart API** - Auto-fallback system  
✅ **CORS Proxy** - Bypass restrictions  
✅ **M3U8 Proxy** - HLS streaming  
✅ **HLS Player** - Quality selection  
✅ **Skip Intro/Outro** - Episode markers  
✅ **Subtitles** - Multi-language support  
✅ **Download** - Video download  

---

## 🔗 API Base URLs

```javascript
const API_SOURCES = {
  hianime: 'https://api-anime.consumet.stream/anime/hianime',
  hianime2: 'https://hianime-api2.vercel.app/api/v1',
  animeMapper: 'https://anime-mapper.vercel.app',
  shashankAnime: 'https://anime-api-one-murex.vercel.app',
  consumet: 'https://api.consumet.org',
  aniwatch: 'https://aniwatch-api.vercel.app/api/v2/hianime'
};
```

---

## 📞 Support

For issues or questions:
- Check console for errors
- Verify API endpoints are accessible
- Test with different browsers
- Clear cache and reload

---

**Made with ❤️ for KHOPADI**
