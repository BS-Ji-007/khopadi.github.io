import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tmdbAPI } from '../utils/api';
import { getImageUrl } from '../config/tmdb';
import { useTheme } from '../App';

const MovieDetails = () => {
  const { id } = useParams();
  const { colors } = useTheme();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    fetchMovieDetails();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      const data = await tmdbAPI.getMovieDetails(id);
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

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <div className="relative h-[80vh]">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10"></div>
        <img
          src={getImageUrl(movie.backdrop_path, 'original', 'backdrop')}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl">
              <h1 className="text-5xl md:text-7xl font-bold mb-4">{movie.title}</h1>
              <div className="flex items-center space-x-4 mb-6">
                <span className="bg-yellow-500 text-black px-3 py-1 rounded font-bold text-lg">
                  ⭐ {movie.vote_average.toFixed(1)}
                </span>
                <span className="text-gray-300">{new Date(movie.release_date).getFullYear()}</span>
                <span className="text-gray-300">{movie.runtime} min</span>
                <span className="text-gray-300">
                  {movie.genres?.map((g) => g.name).join(', ')}
                </span>
              </div>
              <p className="text-lg md:text-xl mb-8 text-gray-300 leading-relaxed">
                {movie.overview}
              </p>
              <div className="flex space-x-4">
                {trailer && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                    <span>Watch Trailer</span>
                  </button>
                )}
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                  Add to Watchlist
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
            <h2 className="text-3xl font-bold mb-6">Cast</h2>
            <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide">
              {movie.credits.cast.slice(0, 10).map((person) => (
                <div key={person.id} className="flex-shrink-0 w-32">
                  <img
                    src={
                      person.profile_path
                        ? getImageUrl(person.profile_path, '/w185', 'profile')
                        : 'https://via.placeholder.com/185x278?text=No+Image'
                    }
                    alt={person.name}
                    className="w-32 h-48 object-cover rounded-lg mb-2"
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
            <h2 className="text-3xl font-bold mb-6">Similar Movies</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {movie.similar.results.slice(0, 12).map((similar) => (
                <Link
                  key={similar.id}
                  to={`/movie/${similar.id}`}
                  className="group cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform group-hover:scale-105">
                    <img
                      src={getImageUrl(similar.poster_path, 'medium', 'poster')}
                      alt={similar.title}
                      className="w-full h-auto"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/342x513?text=No+Poster';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <div>
                        <h3 className="font-semibold text-sm line-clamp-2">{similar.title}</h3>
                        <p className="text-yellow-500 text-xs mt-1">⭐ {similar.vote_average.toFixed(1)}</p>
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
