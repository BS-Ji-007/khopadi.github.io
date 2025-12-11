# 🎬 Khopadi Movies

Ek modern movie streaming platform jo React aur Node.js pe bana hai.

## 🚀 Live Demo

**Frontend (GitHub Pages):** https://bs-ji-007.github.io/khopadi.github.io/

**Backend:** Aapko khud host karna hoga (Render, Railway, ya Vercel pe)

---

## 📋 Features

- 🔐 OTP-based authentication (email verification)
- 🎥 Movies, TV Shows, Anime categories
- 🌙 Dark/Light mode
- 📱 Responsive design
- 🔒 Secure backend with JWT tokens

---

## 🛠️ Setup Instructions

### 1️⃣ **Frontend Setup**

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add:
REACT_APP_API_URL=http://localhost:5000
REACT_APP_TMDB_API_KEY=your_tmdb_api_key

# Run development server
npm start

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### 2️⃣ **Backend Setup**

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit backend/.env and add:
PORT=5000
JWT_SECRET=your_super_secure_secret_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:3000
NODE_ENV=development

# Run development server
npm run dev

# Run production server
npm start
```

---

## 📧 Gmail App Password Setup

OTP emails bhejne ke liye Gmail App Password chahiye:

1. Google Account Settings mein jao
2. Security > 2-Step Verification enable karo
3. Security > App Passwords par jao
4. "Mail" select karo aur "Generate" click karo
5. Generated password ko `EMAIL_PASS` mein dalo

---

## 🌐 Live Deploy Kaise Karein?

### **Frontend (GitHub Pages)**

```bash
# Build aur deploy automatically
npm run deploy
```

Ya manually:
1. `npm run build` chalao
2. GitHub repo settings mein jao
3. Pages section mein `gh-pages` branch select karo
4. 5-10 minute wait karo
5. https://bs-ji-007.github.io/khopadi.github.io/ pe check karo

### **Backend (Render.com - FREE)**

1. https://render.com par jao
2. "New +" > "Web Service" select karo
3. GitHub repo connect karo
4. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Environment Variables add karo:
   - `JWT_SECRET`
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - `FRONTEND_URL` (your GitHub Pages URL)
   - `NODE_ENV=production`
6. "Create Web Service" click karo
7. Deploy hone ke baad URL copy karo (e.g., https://khopadi-backend.onrender.com)
8. Frontend ke `.env` mein `REACT_APP_API_URL` update karo

### **Backend (Railway.app - FREE)**

1. https://railway.app par jao
2. GitHub repo connect karo
3. "backend" folder select karo
4. Environment variables add karo
5. Deploy URL copy karo

---

## 🔧 Common Issues

### ❌ **Site nahi khul rahi**
- GitHub Pages mein 5-10 minute lag sakta hai
- Repo settings > Pages mein check karo ki `gh-pages` branch selected hai
- Browser cache clear karo

### ❌ **OTP email nahi aa raha**
- Gmail App Password sahi hai?
- `EMAIL_USER` aur `EMAIL_PASS` backend `.env` mein hai?
- Backend server chal raha hai?

### ❌ **API calls fail ho rahi hain**
- Frontend `.env` mein `REACT_APP_API_URL` sahi hai?
- Backend CORS settings check karo
- Backend deployed hai?

---

## 📁 Project Structure

```
khopadi.github.io/
├── src/                    # React frontend source
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   ├── utils/             # Helper functions
│   └── App.js             # Main app component
├── backend/               # Node.js backend
│   ├── config/           # Database config
│   ├── models/           # Database models
│   └── server.js         # Express server
├── public/               # Static files
└── build/                # Production build (auto-generated)
```

---

## 🤝 Contributing

Pull requests welcome hain! Bugs report karne ke liye GitHub Issues use karein.

## 📄 License

MIT License - Free to use!

---

## 📞 Support

Issues ya questions ke liye GitHub Issues use karein.

**Happy Coding! 🚀**