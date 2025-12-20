import React, { useState, useEffect } from 'react';
import { hianime } from '../utils/hianimeApi';
import AnimeCard from '../components/AnimeCard';

const Anime = () => {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState('top-airing');

  useEffect(() => {
    loadAnimes();
  }, [page, category]);

  const loadAnimes = async () => {
    setLoading(true);
    let data;
    
    switch(category) {
      case 'top-airing':
        data = await hianime.topAiring(page);
        break;
      case 'popular':
        data = await hianime.popular(page);
        break;
      case 'recent':
        data = await hianime.recentEpisodes(page);
        break;
      default:
        data = await hianime.topAiring(page);
    }
    
    setAnimes(data.animes || []);
    setTotalPages(data.pageInfo?.totalPages || 1);
    setLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categoryOptions = [
    { value: 'top-airing', label: '🔥 Top Airing', emoji: '🔥' },
    { value: 'popular', label: '⭐ Most Popular', emoji: '⭐' },
    { value: 'recent', label: '🆕 Recent Episodes', emoji: '🆕' }
  ];

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold">✨ Anime Hub</h1>
          <p className="mb-4 text-gray-400">Watch the best anime with multiple servers and subtitles</p>
          
          {/* Category Selector */}
          <div className="flex flex-wrap gap-3">
            {categoryOptions.map(option => (
              <button
                key={option.value}
                onClick={() => {
                  setCategory(option.value);
                  setPage(1);
                }}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  category === option.value
                    ? 'bg-red-600 text-white scale-105'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {option.emoji} {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Anime Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {[...Array(18)].map((_, i) => (
              <div key={i} className="aspect-[2/3] animate-pulse rounded-lg bg-gray-800" />
            ))}
          </div>
        ) : animes.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {animes.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-10 flex items-center justify-center gap-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg bg-gray-800 px-6 py-2 font-semibold text-white transition-colors hover:bg-gray-700 disabled:opacity-50"
              >
                ← Previous
              </button>
              <span className="text-lg">
                Page {page} of {Math.min(totalPages, 100)}
              </span>
              <button
                onClick={() => setPage(p => Math.min(100, p + 1))}
                disabled={page >= totalPages || page >= 100}
                className="rounded-lg bg-red-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          </>
        ) : (
          <div className="py-20 text-center">
            <p className="text-xl text-gray-400">🚨 No anime found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Anime;
