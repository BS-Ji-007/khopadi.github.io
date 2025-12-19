# Deployment Fix

## Issue
Old `api.js` was causing import errors

## Solution
- Deleted `src/utils/api.js`
- All pages now use `multiApi.js`
- TMDB API key added

## Commands to Run

```bash
# Pull latest changes
git pull origin main

# Install dependencies (if needed)
npm install

# Deploy
npm run deploy
```

## Fixed
✅ Removed old api.js
✅ All imports updated to multiApi.js
✅ TMDB key configured
✅ Ready to deploy!
