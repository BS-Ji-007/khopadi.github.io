import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tmdb, getImageUrl } from '../utils/multiApi';

const MoviePlayer = () => {
  const { id, type } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentServer, setCurrentServer] = useState(0);

  // Streaming servers
  const servers = [
    {
      name: '2embed',
      url: (id, type) => `https://2embed.cc/embed${type === 'tv' ? '/tv' : ''}/${id}`
    },
    {
      name: 'Vidsrc',
      url: (id, type) => `https://vidsrc.me/embed/${type === 'tv' ? 'tv' : 'movie'}?tmdb=${id}`
    },
    {
      name: 'Vidsrc.vip',
      url: (id, type) => `https://vidsrc.vip/embed/${type === 'tv' ? 'tv' : 'movie'}?tmdb=${id}`
    }
  ];

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await tmdb.details(id, type || 'movie');
        setMovie(data);
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, type]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!movie) return null;

  const contentType = type || 'movie';
  const streamUrl = servers[currentServer].url(id, contentType);

  return (
    <div className="min-h-screen pt-16 bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back</span>
        </button>

        {/* Video Player */}
        <div className="relative bg-black rounded-lg overflow-hidden mb-6 shadow-2xl">
          <div className="aspect-video">
            <iframe
              src={streamUrl}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              title={movie.title || movie.name}
            ></iframe>
          </div>
        </div>

        {/* Movie Info */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Poster */}
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <img
                src={getImageUrl(movie.poster_path, 'w342')}
                alt={movie.title || movie.name}
                className="w-48 h-auto rounded-lg shadow-lg"
                onError={(e) => { e.target.src = '/placeholder-movie.jpg'; }}
              />
            </div>

            {/* Details */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">{movie.title || movie.name}</h1>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                <span className="bg-yellow-500 text-black px-3 py-1 rounded font-bold">
                  ⭐ {movie.vote_average?.toFixed(1) || 'N/A'}
                </span>
                <span className="text-gray-400">
                  {movie.release_date ? new Date(movie.release_date).getFullYear() : 
                   movie.first_air_date ? new Date(movie.first_air_date).getFullYear() : 'N/A'}
                </span>
                {movie.runtime && (
                  <span className="text-gray-400">{movie.runtime} min</span>
                )}
                <span className="text-gray-400">
                  {movie.genres?.map(g => g.name).join(', ') || 'N/A'}
                </span>
              </div>

              <p className="text-gray-300 leading-relaxed mb-4">
                {movie.overview || 'No description available'}
              </p>

              {movie.credits?.cast && movie.credits.cast.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-2">🎭 Cast</h3>
                  <p className="text-gray-400">
                    {movie.credits.cast.slice(0, 5).map(c => c.name).join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Server Selection */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">🌐 Select Server</h3>
          <p className="text-sm text-gray-400 mb-4">
            If current server is not working, try switching to another server.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
            {servers.map((server, index) => (
              <button
                key={index}
                onClick={() => setCurrentServer(index)}
                className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold transition-all ${
                  currentServer === index
                    ? 'bg-red-600 text-white scale-105'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                📡 {server.name}
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg p-4">
          <p className="text-yellow-500 text-sm">
            ⚠️ <strong>Note:</strong> Streaming sources are third-party embedded players. 
            If a server doesn't work, please try another one. Some content may not be available.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MoviePlayer;