import React, { useState, useEffect } from 'react';
import { hianime } from '../utils/hianimeApi';
import AnimeCard from '../components/AnimeCard';

const CATEGORIES = [
  { value: 'top-airing', label: 'Top Airing', icon: '🔥' },
  { value: 'popular', label: 'Most Popular', icon: '⭐' },
  { value: 'recent', label: 'Recent Episodes', icon: '🆕' },
];

//todo after remove sync test
const Anime = () => {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState('top-airing');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadAnimes(); }, [page, category]);

  //todo test 2.o
  const loadAnimes = async () => {
    setLoading(true);
    let data;
    if (category === 'popular') data = await hianime.popular(page);
    else if (category === 'recent') data = await hianime.recentEpisodes(page);
    else data = await hianime.topAiring(page);
    setAnimes(data.animes || []);
    setTotalPages(data.pageInfo?.totalPages || 1);
    setLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  //todo 555555
  return (
    <div className="min-h-screen pt-24 pb-10" style={{ background: 'var(--bg-deep)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="font-display text-5xl text-white tracking-wide mb-2">ANIME HUB</h1>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Watch the best anime with multiple servers & subtitles</p>

          {/* Category pills */}
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => { setCategory(cat.value); setPage(1); }}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                style={
                  category === cat.value
                    ? { background: 'var(--red)', color: '#fff', boxShadow: '0 4px 20px var(--red-glow)' }
                    : { background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }
                }
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[...Array(18)].map((_, i) => (
              <div key={i} className="aspect-[2/3] rounded-xl skeleton" />
            ))}
          </div>
        ) : animes.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {animes.map((anime, i) => (
                <div key={anime.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i * 25, 300)}ms` }}>
                  <AnimeCard anime={anime} />
                </div>
              ))}
            </div>

            <div className="mt-12 flex items-center justify-center gap-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 hover:bg-white/10"
                style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
              >
                ← Prev
              </button>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Page <span className="text-white font-semibold">{page}</span> of {Math.min(totalPages, 100)}
              </span>
              <button
                onClick={() => setPage(p => Math.min(100, p + 1))}
                disabled={page >= totalPages || page >= 100}
                className="btn-primary text-sm disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </>
        ) : (
          <div className="py-20 text-center">
            <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>No anime found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Anime;
