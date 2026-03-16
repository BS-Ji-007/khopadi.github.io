/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#e8102a',
        'primary-dark': '#b30d20',
        dark: {
          950: '#060810',
          900: '#0e1117',
          800: '#161b26',
          700: '#1e2535',
          600: '#2a3347',
        },
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeInUp 0.5s ease forwards',
        'shimmer': 'shimmer 1.6s infinite linear',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(105deg, #060810 0%, rgba(6,8,16,0.88) 40%, rgba(6,8,16,0.3) 75%, transparent 100%)',
      },
    },
  },
  plugins: [],
};
