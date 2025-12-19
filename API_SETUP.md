# 🔑 API Setup Instructions

## TMDB API Setup (Required)

### Step 1: Get TMDB API Key

1. Visit: https://www.themoviedb.org/signup
2. Create a free account
3. Go to: https://www.themoviedb.org/settings/api
4. Click "Create" and fill the form:
   - Type: Website
   - Name: Khopadi Movies
   - URL: https://bs-ji-007.github.io/khopadi.github.io/
5. Copy your **API Key (v3 auth)**

### Step 2: Add API Key to Project

Open `src/utils/api.js` and replace:

```javascript
const TMDB_API_KEY = 'YOUR_TMDB_API_KEY';
```

With:

```javascript
const TMDB_API_KEY = 'your_actual_api_key_here';
```

### Step 3: Deploy

Run in Codespaces:

```bash
npm run deploy
```

---

## What's Included

✅ **Homepage:** Trending movies with hero section  
✅ **Movies Page:** Popular movies with pagination  
✅ **TV Shows Page:** Popular TV series  
✅ **Anime Page:** Top anime shows  
✅ **Upcoming Page:** Coming soon movies  
✅ **Search:** Real-time movie/TV search  
✅ **Responsive:** Mobile-friendly design  
✅ **Dark Mode:** Beautiful dark theme  

---

## Features Added

- Real movie data from TMDB API
- High-quality movie posters
- Ratings and release years
- Smooth animations and hover effects
- Loading skeletons
- Pagination for all pages
- Advanced search functionality
- Responsive grid layouts

---

## API Limits

- **TMDB:** 1,000 requests per day (Free)
- **Rate Limit:** 50 requests per second

More than enough for personal projects!

---

## Support

If you need help:
1. Check TMDB documentation: https://developers.themoviedb.org/3
2. Verify your API key is valid
3. Check browser console for errors
