import { useState, useEffect } from 'react';
import { getMovies } from './services/apiservice';
import MovieModal from './components/MovieModal';
import './index.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      const { movies, error } = await getMovies('/trending/movie/week');
      if (error) {
        setError(error);
      } else {
        setMovies(movies);
      }
      setLoading(false);
    };
    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center flex-col">
        <div className="text-6xl mb-4">🎬</div>
        <div className="text-white text-2xl mb-2">Connection Error</div>
        <div className="text-gray-400">HTTP Error: 401 - {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Header */}
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-4xl font-bold text-red-600">OTT CINEMA</h1>
        <input 
          type="text" 
          placeholder="🔍 Search..." 
          className="bg-zinc-800 px-4 py-2 rounded text-white"
        />
      </div>

      {/* Movies Grid */}
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">⭐ Top Rated</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {movies.map((movie) => (
            <div 
              key={movie.id} 
              onClick={() => setSelectedMovie(movie)}
              className="cursor-pointer hover:scale-105 transition-transform"
            >
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="rounded-lg w-full"
              />
              <p className="mt-2 text-sm truncate">{movie.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Movie Modal - Play Now wala */}
      {selectedMovie && (
        <MovieModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
        />
      )}
    </div>
  );
}

export default App;
