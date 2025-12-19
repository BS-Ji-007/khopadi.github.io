# 🔑 API Keys Setup Guide

## Free APIs (No Key Needed) ✅

These work out of the box:

- **TVMaze** - TV show data
- **Movie Quotes** - Random quotes
- **IMDbOT** - Movie search (unofficial)

---

## APIs Requiring Keys

### 1. TMDB (The Movie Database) - PRIMARY

**Best for:** Movies, TV Shows, Anime, Trailers

#### Setup:
1. Sign up: https://www.themoviedb.org/signup
2. Verify email
3. Go to: https://www.themoviedb.org/settings/api
4. Click "Create" and fill form
5. Copy **API Key (v3 auth)**

#### Add to code:
Open `src/utils/multiApi.js` line 9:
```javascript
const TMDB_API_KEY = 'your_key_here';
```

**Free Tier:** 1,000 requests/day

---

### 2. OMDb (Already Configured) ✅

**Best for:** Quick movie search

Already has a free key in code: `3c0368f7`

If you need your own:
1. Visit: http://www.omdbapi.com/apikey.aspx
2. Get free key (1,000 requests/day)

---

### 3. Trakt (Optional)

**Best for:** Trending content, user ratings

#### Setup:
1. Sign up: https://trakt.tv/join
2. Create app: https://trakt.tv/oauth/applications/new
3. Get API key

Open `src/utils/multiApi.js` line 19:
```javascript
const TRAKT_API_KEY = 'your_key_here';
```

**Free Tier:** Unlimited

---

## Recommended Setup

### Minimal (Free):
✅ TMDB only - Get trending, movies, TV, anime

### Full (Free):
✅ TMDB - Main data source
✅ TVMaze - Additional TV data
✅ Trakt - Trending & ratings
✅ OMDb - Backup search

---

## API Features Comparison

| API | Movies | TV Shows | Anime | Search | Free Limit |
|-----|--------|----------|-------|--------|------------|
| TMDB | ✅ | ✅ | ✅ | ✅ | 1K/day |
| TVMaze | ❌ | ✅ | ❌ | ✅ | Unlimited |
| OMDb | ✅ | ✅ | ❌ | ✅ | 1K/day |
| Trakt | ✅ | ✅ | ✅ | ✅ | Unlimited |
| IMDbOT | ✅ | ✅ | ❌ | ✅ | Unlimited |

---

## Quick Start

1. Get TMDB API key (5 minutes)
2. Add to `src/utils/multiApi.js`
3. Deploy: `npm run deploy`
4. Done! 🎉

---

## Troubleshooting

### "API key invalid"
- Check if key is correct
- Wait 5 minutes after creating key
- Verify account email

### "Rate limit exceeded"
- Using free tier too much
- Wait 24 hours for reset
- Or upgrade to paid tier

### "CORS error"
- Normal for browser requests
- APIs will work from server
- Or use CORS proxy

---

**Need help?** Check the API documentation links above!
