import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const OMDB_API_KEY = 'da8322ee';
const OMDB_BASE_URL = 'https://www.omdbapi.com';

const MovieDetails = () => {
  const { id } = useParams(); // imdbID from route
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(`${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY}&i=${id}&plot=full`);
        const json = await res.json();
        if (json && json.Response === 'True') {
          setData(json);
        } else {
          setError(json?.Error || 'Details not found');
        }
      } catch (e) {
        setError('Failed to fetch details');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetails();
  }, [id]);

  if (loading) return <div className="pt-24 text-center">Loading details...</div>;
  if (error) return <div className="pt-24 text-center text-red-400">{error}</div>;
  if (!data) return null;

  return (
    <div className="pt-24 container mx-auto px-6">
      <Link to="/" className="text-yellow-400 hover:text-yellow-300">← Back</Link>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          {data.Poster && data.Poster !== 'N/A' ? (
            <img src={data.Poster} alt={data.Title} className="rounded-lg shadow-lg w-full" />
          ) : (
            <div className="w-full h-96 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400">No Image</div>
          )}
        </div>
        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold mb-2">{data.Title}</h1>
          <p className="text-gray-400 mb-4">{data.Year} • {data.Rated} • {data.Runtime}</p>
          <div className="mb-4">
            <span className="font-semibold">Genre:</span> {data.Genre}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Director:</span> {data.Director}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Writer:</span> {data.Writer}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Actors:</span> {data.Actors}
          </div>
          <p className="leading-7 mb-6">{data.Plot}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-gray-800">
              <div className="text-sm text-gray-400">IMDb</div>
              <div className="text-xl font-bold">{data.imdbRating}</div>
            </div>
            <div className="p-4 rounded-lg bg-gray-800">
              <div className="text-sm text-gray-400">Metascore</div>
              <div className="text-xl font-bold">{data.Metascore}</div>
            </div>
            <div className="p-4 rounded-lg bg-gray-800">
              <div className="text-sm text-gray-400">Box Office</div>
              <div className="text-xl font-bold">{data.BoxOffice || 'N/A'}</div>
            </div>
            <div className="p-4 rounded-lg bg-gray-800">
              <div className="text-sm text-gray-400">Awards</div>
              <div className="text-xl font-bold">{data.Awards}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;

// v0.1.05: Switched MovieDetails to OMDb details endpoint
