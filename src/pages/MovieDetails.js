import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { tmdb, getImageUrl } from '../utils/multiApi';
import { useTheme } from '../App';

const MovieDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const { colors } = useTheme();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);

  // Determine if it's a movie or TV show
  const contentType = location.pathname.includes('/tv/') ? 'tv' : 'movie';

  useEffect(() => {
    fetchMovieDetails();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      const data = await tmdb.details(id, contentType);
      setMovie(data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!movie) return null;

  const trailer = movie.videos?.results?.find(
    (video) => video.type === 'Trailer' && video.site === 'YouTube'
  );

  const title = movie.title || movie.name;

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <div className="relative h-[80vh]">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10"></div>
        <img
          src={getImageUrl(movie.backdrop_path, 'original')}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl">
              <h1 className="text-5xl md:text-7xl font-bold mb-4">{title}</h1>
              <div className="flex items-center space-x-4 mb-6">
                <span className="bg-yellow-500 text-black px-3 py-1 rounded font-bold text-lg">
                  ⭐ {movie.vote_average?.toFixed(1) || 'N/A'}
                </span>
                <span className="text-gray-300">
                  {movie.release_date ? new Date(movie.release_date).getFullYear() : 
                   movie.first_air_date ? new Date(movie.first_air_date).getFullYear() : 'N/A'}
                </span>
                {movie.runtime && (
                  <span className="text-gray-300">{movie.runtime} min</span>
                )}
                {movie.number_of_seasons && (
                  <span className="text-gray-300">{movie.number_of_seasons} Seasons</span>
                )}
                <span className="text-gray-300">
                  {movie.genres?.map((g) => g.name).join(', ') || 'N/A'}
                </span>
              </div>
              <p className="text-lg md:text-xl mb-8 text-gray-300 leading-relaxed">
                {movie.overview || 'No description available'}
              </p>
              <div className="flex space-x-4">
                {/* Watch Now Button */}
                <Link
                  to={`/watch/${contentType}/${id}`}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                  <span>▶ Watch Now</span>
                </Link>

                {/* Trailer Button */}
                {trailer && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    <span>🎥 Trailer</span>
                  </button>
                )}

                <button className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                  ➕ Watchlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && trailer && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowTrailer(false)}
        >
          <div className="relative w-full max-w-6xl aspect-video" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-12 right-0 text-white hover:text-red-500 text-4xl"
            >
              ×
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              className="w-full h-full rounded-lg"
              allowFullScreen
              allow="autoplay"
            ></iframe>
          </div>
        </div>
      )}

      {/* Details Section */}
      <div className="container mx-auto px-6 py-12">
        {/* Cast */}
        {movie.credits?.cast && movie.credits.cast.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">🎭 Cast</h2>
            <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide">
              {movie.credits.cast.slice(0, 10).map((person) => (
                <div key={person.id} className="flex-shrink-0 w-32">
                  <img
                    src={person.profile_path ? getImageUrl(person.profile_path, 'w185') : '/placeholder-movie.jpg'}
                    alt={person.name}
                    className="w-32 h-48 object-cover rounded-lg mb-2"
                    onError={(e) => e.target.src = '/placeholder-movie.jpg'}
                  />
                  <p className="font-semibold text-sm">{person.name}</p>
                  <p className="text-xs text-gray-400">{person.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar Movies */}
        {movie.similar?.results && movie.similar.results.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-6">🎬 Similar {contentType === 'tv' ? 'Shows' : 'Movies'}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {movie.similar.results.slice(0, 12).map((similar) => (
                <Link
                  key={similar.id}
                  to={`/${contentType}/${similar.id}`}
                  className="group cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform group-hover:scale-105">
                    <img
                      src={getImageUrl(similar.poster_path, 'w342')}
                      alt={similar.title || similar.name}
                      className="w-full h-auto"
                      onError={(e) => e.target.src = '/placeholder-movie.jpg'}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <div>
                        <h3 className="font-semibold text-sm line-clamp-2">{similar.title || similar.name}</h3>
                        <p className="text-yellow-500 text-xs mt-1">⭐ {similar.vote_average?.toFixed(1) || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
