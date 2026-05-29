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
  getHindiWebSeries,
  searchMovies
} from './services/apiservice';
import MovieModal from './components/MovieModal';
import './index.css';

function App() {
  const [category, setCategory] = useState('trending');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);

  const categories = [
    { key: 'trending', name: '🔥 Trending', func: (p) => getMovies('/trending/all/week', p) },
    { key: 'bollywood', name: '🇮🇳 Bollywood', func: getBollywoodMovies },
    { key: 'south', name: 'South Hindi', func: getSouthHindiMovies },
    { key: 'hollywood_hindi', name: 'Hollywood Hindi', func: getHollywoodHindi },
    { key: 'netflix', name: 'Netflix', func: getNetflixMovies },
    { key: 'prime', name: 'Prime Video', func: getPrimeMovies },
    { key: 'hotstar', name: 'JioHotstar', func: getHotstarMovies },
    { key: 'kdrama', name: 'K-Drama', func: getKDrama },
    { key: 'webseries', name: 'Hindi Series', func: getHindiWebSeries },
  ];

  const fetchMovies = async (reset = true) => {
    setLoading(true);
    setError(null);
    const currentPage = reset? 1 : page;
    
    let result;
    if (searchQuery) {
      result = await searchMovies(searchQuery, currentPage);
    } else {
      const selectedCat = categories.find(c => c.key === category);
      result = await selectedCat.func(currentPage);
    }
    
    if (result.error) {
      setError(result.error);
    } else {
      setMovies(reset? result.movies : [...movies,...result.movies]);
      setPage(currentPage + 1);
    }
    setLoading(false);
  };

  useEffect(() => {
    setPage(1);
    fetchMovies(true);
  }, [category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchMovies(true);
  };

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
      {/* Header with Menu + Search */}
      <div className="p-4 sticky top-0 bg-black/90 backdrop-blur z-40">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl">☰</button>
            <h1 className="text-3xl font-bold text-red-600">OTT CINEMA</h1>
          </div>
        </div>
        
        {/* Search Box */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <input 
            type="text" 
            placeholder="🔍 Search Hindi Movies, Web Series..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-zinc-800 px-4 py-2 rounded text-white flex-1"
          />
          <button type="submit" className="bg-red-600 px-4 py-2 rounded">Search</button>
        </form>

        {/* Side Menu */}
        {menuOpen && (
          <div className="absolute top-16 left-0 bg-zinc-900 w-64 p-4 rounded-lg shadow-xl" onClick={() => setMenuOpen(false)}>
            <div className="text-xl font-bold mb-4">Menu</div>
            <div className="flex flex-col gap-2">
              <a href="#" className="hover:text-red-500">Home</a>
              <a href="#" className="hover:text-red-500">Movies</a>
              <a href="#" className="hover:text-red-500">TV Shows</a>
              <a href="#" className="hover:text-red-500">My List</a>
            </div>
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="px-4 flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => { setCategory(cat.key); setSearchQuery(''); }}
            className={`px-4 py-2 rounded whitespace-nowrap font-semibold transition-colors ${category === cat.key &&!searchQuery? 'bg-red-600' : 'bg-zinc-800 hover:bg-zinc-700'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Movies Grid */}
      <div className="p-4">
        {loading && movies.length === 0? (
          <div className="text-center text-xl mt-20">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {movies.map(movie => (
                <div 
                  key={`${movie.id}-${movie.media_type}`} 
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
            
            {/* Load More Button - 1000+ movies ke liye */}
            {!loading && movies.length > 0 && (
              <div className="text-center mt-8">
                <button 
                  onClick={() => fetchMovies(false)} 
                  className="bg-red-600 px-8 py-3 rounded font-bold hover:bg-red-700"
                >
                  Load More Movies
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {selectedMovie && <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}
    </div>
  )
}

export default App;
