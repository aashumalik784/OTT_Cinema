import { useState, useEffect } from 'react';
import { 
  getMovies, 
  getBollywoodMovies, 
  getSouthHindiMovies,
  getHollywoodHindi,
  getNetflixMovies,
  getPrimeMovies,
  getHotstarMovies,
  getKDrama,
  getHindiWebSeries
} from './services/apiservice';
import MovieModal from './components/MovieModal';
import './index.css';

function App() {
  const [category, setCategory] = useState('trending');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const categories = [
    { key: 'trending', name: '🔥 Trending', func: () => getMovies('/trending/all/week') },
    { key: 'bollywood', name: '🇮🇳 Bollywood', func: getBollywoodMovies },
    { key: 'south', name: 'South Hindi', func: getSouthHindiMovies },
    { key: 'hollywood_hindi', name: 'Hollywood Hindi', func: getHollywoodHindi },
    { key: 'netflix', name: 'Netflix', func: getNetflixMovies },
    { key: 'prime', name: 'Prime Video', func: getPrimeMovies },
    { key: 'hotstar', name: 'JioHotstar', func: getHotstarMovies },
    { key: 'kdrama', name: 'K-Drama', func: getKDrama },
    { key: 'webseries', name: 'Hindi Series', func: getHindiWebSeries },
  ];

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      const selectedCat = categories.find(c => c.key === category);
      const { movies, error } = await selectedCat.func();
      if (error) {
        setError(error);
      } else {
        setMovies(movies);
      }
      setLoading(false);
    };
    fetchMovies();
  }, [category]);

  if (error) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center flex-col">
        <div className="text-6xl mb-4">🎬</div>
        <div className="text-white text-2xl mb-2">Connection Error</div>
        <div className="text-gray-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Header */}
      <div className="p-4 flex justify-between items-center sticky top-0 bg-black/90 backdrop-blur z-40">
        <h1 className="text-4xl font-bold text-red-600">OTT CINEMA</h1>
      </div>

      {/* Categories */}
      <div className="px-4 flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => setCategory(cat.key)}
            className={`px-4 py-2 rounded whitespace-nowrap font-semibold transition-colors ${category === cat.key? 'bg-red-600' : 'bg-zinc-800 hover:bg-zinc-700'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Movies Grid */}
      <div className="p-4">
        {loading? (
          <div className="text-center text-xl mt-20">Loading...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {movies.map(movie => (
              <div 
                key={movie.id} 
                onClick={() => setSelectedMovie({...movie, media_type: movie.media_type || (movie.first_air_date? 'tv' : 'movie')})}
                className="cursor-pointer hover:scale-105 transition-transform"
              >
                <img 
                  src={movie.poster_path? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image'}
                  alt={movie.title || movie.name}
                  className="rounded-lg w-full aspect-[2/3] object-cover"
                  loading="lazy"
                />
                <p className="mt-2 text-sm truncate">{movie.title || movie.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Movie Modal */}
      {selectedMovie && (
        <MovieModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
        />
      )}
    </div>
  )
}

export default App;
