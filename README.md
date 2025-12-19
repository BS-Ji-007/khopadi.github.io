# 🎬 Khopadi Movies

**A modern, full-stack movie streaming website built with React and Node.js**

🌐 **Live Site:** https://bs-ji-007.github.io/khopadi.github.io/

---

## ✨ Features

### Frontend
- 🎥 Browse trending movies, TV shows, and anime
- 🔍 Real-time search functionality
- 📱 Fully responsive design
- 🌙 Dark mode with beautiful UI
- ⭐ Movie ratings and details
- 📄 Pagination for all categories
- 🎨 Smooth animations and transitions

### Backend
- 🔐 User authentication (Login/Register)
- 📧 OTP verification via email
- 🔒 JWT-based security
- 💾 SQLite database
- 🚀 RESTful API

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- npm or yarn
- TMDB API key (free)

### Installation

#### 1. Clone Repository
```bash
git clone https://github.com/BS-Ji-007/khopadi.github.io.git
cd khopadi.github.io
```

#### 2. Setup Frontend
```bash
npm install
```

#### 3. Get TMDB API Key
1. Visit: https://www.themoviedb.org/signup
2. Create account and get API key
3. Open `src/utils/api.js`
4. Replace `YOUR_TMDB_API_KEY` with your actual key

#### 4. Run Development Server
```bash
npm start
```

Visit: http://localhost:3000

#### 5. Deploy
```bash
npm run deploy
```

---

## 🔧 Backend Setup (Optional)

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials
npm run dev
```

**Backend URL:** https://khopadi-github-io.onrender.com

---

## 📁 Project Structure

```
khopadi.github.io/
├── public/              # Static files
├── src/
│   ├── components/      # React components
│   │   ├── Navbar.js
│   │   └── MovieCard.js
│   ├── pages/          # Page components
│   │   ├── Home.js
│   │   ├── Movies.js
│   │   ├── TVShows.js
│   │   ├── Anime.js
│   │   └── Upcoming.js
│   ├── utils/          # Utilities
│   │   └── api.js      # API functions
│   ├── App.js          # Main app
│   └── index.js        # Entry point
├── backend/            # Node.js backend
│   ├── server.js
│   └── routes/
└── package.json
```

---

## 🎯 Tech Stack

### Frontend
- React 18
- React Router DOM
- Axios
- Tailwind CSS
- TMDB API

### Backend
- Node.js
- Express.js
- Sequelize (SQLite)
- JWT
- Nodemailer

### Deployment
- Frontend: GitHub Pages
- Backend: Render.com

---

## 📸 Screenshots

- **Homepage:** Trending movies with search
- **Movies:** Grid of popular movies
- **TV Shows:** Popular TV series
- **Anime:** Top anime shows
- **Upcoming:** Coming soon releases

---

## 🔑 API Setup

See [API_SETUP.md](./API_SETUP.md) for detailed instructions.

---

## 📝 License

MIT License - Feel free to use for your projects!

---

## 👨‍💻 Developer

**BS-Ji-007**

- GitHub: [@BS-Ji-007](https://github.com/BS-Ji-007)
- Email: bsji007007@gmail.com

---

## 🙏 Acknowledgments

- [TMDB API](https://www.themoviedb.org/documentation/api) for movie data
- [OMDb API](http://www.omdbapi.com/) for additional data
- React community for amazing tools

---

**Made with ❤️ by BS-Ji-007**
