import { useState, useEffect, useCallback } from 'react'
import { getMovies, searchMovies } from './services/apiservice'

function App() {
  const [trending, setTrending] = useState([])
  const [topRated, setTopRated] = useState([])
  const [upcoming, setUpcoming] = useState([])
  const [popular, setPopular] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [error, setError] = useState(null)
  const [activeGenre, setActiveGenre] = useState('all')

  const genres = [
    { id: 'all', name: 'All' },
    { id: 28, name: 'Action' },
    { id: 35, name: 'Comedy' },
    { id: 18, name: 'Drama' },
    { id: 27, name: 'Horror' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Sci-Fi' }
  ]

  // Load all categories
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const [trendData, topData, upData, popData] = await Promise.all([
          getMovies(1),
          fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=hi-IN&page=1`).then(r => r.json()),
          fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=hi-IN&page=1`).then(r => r.json()),
          fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=hi-IN&page=1`).then(r => r.json())
        ])

        if (trendData.error) throw new Error(trendData.error)
        
        setTrending(formatMovies(trendData.movies))
        setTopRated(formatMovies(topData.results))
        setUpcoming(formatMovies(upData.results))
        setPopular(formatMovies(popData.results))
        
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchAllData()
  }, [])

  const formatMovies = (movies) => {
    const IMG_BASE = "https://image.tmdb.org/t/p/w500"
    const BACKDROP = "https://image.tmdb.org/t/p/original"
    
    return movies.map(m => ({
    ...m,
      poster_url: m.poster_path? `${IMG_BASE}${m.poster_path}` : null,
      backdrop_url: m.backdrop_path? `${BACKDROP}${m.backdrop_path}` : null,
      year: m.release_date?.split('-')[0] || 'N/A',
      rating: m.vote_average? m.vote_average.toFixed(1) : 'N/A'
    }))
  }

  // Search with debounce
  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([])
      return
    }

    const delaySearch = setTimeout(async () => {
      const data = await searchMovies(search, 1)
      setSearchResults(formatMovies(data.movies))
    }, 500)

    return () => clearTimeout(delaySearch)
  }, [search])

  const bannerMovie = trending[0]

  const filterByGenre = (movies) => {
    if (activeGenre === 'all') return movies
    return movies.filter(m => m.genre_ids?.includes(Number(activeGenre)))
  }

  const openModal = (movie) => {
    setSelectedMovie(movie)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setSelectedMovie(null)
    document.body.style.overflow = 'auto'
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-[#141414] text-white flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-8xl mb-6">🎬</div>
          <h2 className="text-3xl font-bold mb-4">Connection Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button onClick={() => window.location.reload()} 
            className="px-8 py-3 bg-red-600 rounded-lg hover:bg-red-700 transition font-bold">
            🔄 Retry
          </button>
        </div>
      </div>
    )
  }

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6 animate-pulse">🎬</div>
          <div className="text-4xl mb-6 font-black text-red-600">OTT CINEMA</div>
          <div className="flex gap-2 justify-center">
            <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
          <p className="text-gray-400 mt-6">Loading amazing movies...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-black via-black/80 to-transparent px-4 md:px-12 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-3xl md:text-4xl font-black text-red-600 cursor-pointer">OTT CINEMA</h1>
            <div className="hidden md:flex gap-6 text-sm">
              <a href="#" className="hover:text-gray-300 transition">Home</a>
              <a href="#" className="hover:text-gray-300 transition">Movies</a>
              <a href="#" className="hover:text-gray-300 transition">Series</a>
              <a href="#" className="hover:text-gray-300 transition">My List</a>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="🔍 Search..." 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                className="w-40 md:w-64 px-4 py-2 rounded bg-black/60 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-white transition text-sm"
              />
            </div>
            <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center font-bold cursor-pointer">
              U
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      {bannerMovie &&!search && (
        <div className="relative h-screen w-full">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bannerMovie.backdrop_url})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
          </div>
          
          <div className="relative h-full flex items-center px-4 md:px-12 lg:px-20 pt-20">
            <div className="max-w-3xl">
              <div className="flex gap-3 mb-5 flex-wrap">
                <span className="px-4 py-1.5 bg-red-600 rounded text-sm font-bold">🔥 #1 Trending</span>
                <span className="px-4 py-1.5 bg-yellow-600/90 rounded text-sm font-bold">⭐ {bannerMovie.rating}</span>
                <span className="px-4 py-1.5 bg-blue-600/90 rounded text-sm font-bold">📅 {bannerMovie.year}</span>
                <span className="px-4 py-1.5 bg-green-600/90 rounded text-sm font-bold">HD</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-none drop-shadow-2xl">
                {bannerMovie.title}
              </h1>
              
              <p className="text-lg md:text-xl text-gray-200 mb-8 line-clamp-3 max-w-2xl drop-shadow-lg">
                {bannerMovie.overview}
              </p>
              
              <div className="flex gap-4 flex-wrap">
                <button 
                  onClick={() => openModal(bannerMovie)}
                  className="px-8 py-4 bg-white text-black rounded font-bold text-lg hover:bg-gray-200 transition flex items-center gap-2"
                >
                  ▶️ Play Now
                </button>
                <button 
                  onClick={() => openModal(bannerMovie)}
                  className="px-8 py-4 bg-gray-600/70 rounded font-bold text-lg hover:bg-gray-600 transition flex items-center gap-2"
                >
                  ℹ️ More Info
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Genre Filter */}
      {!search && (
        <div className="px-4 md:px-12 py-6 bg-[#141414]">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {genres.map(g => (
              <button
                key={g.id}
                onClick={() => setActiveGenre(g.id)}
                className={`px-6 py-2 rounded-full whitespace-nowrap font-semibold transition ${
                  activeGenre === g.id 
                  ? 'bg-red-600 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {search && (
        <div className="px-4 md:px-12 py-8 mt-20">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Search Results for "{search}" 
            <span className="text-gray-500 text-lg ml-3">({searchResults.length} found)</span>
          </h2>
          <MovieGrid movies={searchResults} onMovieClick={openModal} />
        </div>
      )}

      {/* Movie Rows */}
      {!search && (
        <div className="px-4 md:px-12 py-8 space-y-12 bg-[#141414]">
          <MovieRow title="🔥 Trending Now" movies={filterByGenre(trending)} onMovieClick={openModal} />
          <MovieRow title="⭐ Top Rated" movies={filterByGenre(topRated)} onMovieClick={openModal} />
          <MovieRow title="🎬 Popular on OTT" movies={filterByGenre(popular)} onMovieClick={openModal} />
          <MovieRow title="📅 Coming Soon" movies={filterByGenre(upcoming)} onMovieClick={openModal} />
        </div>
      )}

      {/* Footer */}
      <footer className="bg-black text-gray-500 py-12 px-4 md:px-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Help</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Cookies</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Follow Us</h4>
              <div className="flex gap-4 text-2xl">
                <a href="#" className="hover:text-white">📘</a>
                <a href="#" className="hover:text-white">🐦</a>
                <a href="#" className="hover:text-white">📷</a>
                <a href="#" className="hover:text-white">📺</a>
              </div>
            </div>
          </div>
          <div className="text-center text-sm pt-8 border-t border-gray-800">
            <p className="mb-2">🎬 OTT Cinema © 2026 | {trending.length + topRated.length + popular.length + upcoming.length}+ Movies</p>
            <p className="text-xs">Powered by TMDB API | Made with ❤️ by aashumalik784</p>
          </div>
        </div>
      </footer>

      {/* Movie Detail Modal */}
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={closeModal} />}
    </div>
  )
}

// Movie Row Component
function MovieRow({ title, movies, onMovieClick }) {
  if (!movies || movies.length === 0) return null
  
  return (
    <div>
      <h3 className="text-xl md:text-2xl font-bold mb-4">{title}</h3>
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
        {movies.map((movie, idx) => (
          <div 
            key={`${movie.id}-${idx}`}
            onClick={() => onMovieClick(movie)}
            className="flex-shrink-0 w-40 md:w-48 lg:w-56 cursor-pointer group"
          >
            <div className="relative overflow-hidden rounded-lg shadow-lg">
              <img 
                src={movie.poster_url || "https://via.placeholder.com/500x750/111/fff?text=No+Image"} 
                alt={movie.title}
                className="w-full h-60 md:h-72 lg:h-80 object-cover group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform">
                <p className="text-white text-sm font-bold line-clamp-2">{movie.title}</p>
                <p className="text-gray-300 text-xs">⭐ {movie.rating} | {movie.year}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Movie Grid Component
function MovieGrid({ movies, onMovieClick }) {
  if (movies.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🔍</div>
        <p className="text-gray-400 text-xl">No movies found</p>
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {movies.map((movie, idx) => (
        <div 
          key={`${movie.id}-${idx}`}
          onClick={() => onMovieClick(movie)}
          className="group bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-red-600/50"
        >
          <div className="relative overflow-hidden">
            <img 
              src={movie.poster_url || "https://via.placeholder.com/500x750/111/fff?text=No+Poster"} 
              alt={movie.title} 
              className="w-full h-64 md:h-80 object-cover group-hover:scale-110 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute top-2 left-2 bg-black/90 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
              ⭐ {movie.rating}
            </div>
            <div className="absolute top-2 right-2 bg-black/90 px-2 py-1 rounded text-xs">
              {movie.year}
            </div>
          </div>
          <div className="p-3">
            <h4 className="text-white font-semibold text-sm line-clamp-2 mb-1" title={movie.title}>
              {movie.title}
            </h4>
            <div className="flex justify-between text-gray-500 text-xs">
              <span>{movie.original_language?.toUpperCase()}</span>
              <span>{movie.vote_count} votes</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Movie Modal Component
function MovieModal({ movie, onClose }) {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-[#181818] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative">
          <img 
            src={movie.backdrop_url || movie.poster_url} 
            alt={movie.title}
            className="w-full h-64 md:h-96 object-cover"
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/70 hover:bg-black flex items-center justify-center text-2xl"
          >
            ×
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#181818] to-transparent h-32" />
        </div>
        
        <div className="p-6 md:p-8">
          <h2 className="text-3xl md:text-5xl font-black mb-4">{movie.title}</h2>
          
          <div className="flex gap-4 mb-6 flex-wrap">
            <span className="px-3 py-1 bg-green-600 rounded text-sm font-bold">⭐ {movie.rating}/10</span>
            <span className="px-3 py-1 bg-blue-600 rounded text-sm font-bold">📅 {movie.year}</span>
            <span className="px-3 py-1 bg-purple-600 rounded text-sm font-bold">🎬 HD</span>
            <span className="px-3 py-1 bg-gray-700 rounded text-sm">{movie.vote_count} votes</span>
          </div>
          
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">{movie.overview}</p>
          
          <div className="flex gap-4 flex-wrap">
            <button className="px-8 py-4 bg-white text-black rounded font-bold text-lg hover:bg-gray-200 transition flex items-center gap-2">
              ▶️ Play Now
            </button>
            <button className="px-8 py-4 bg-gray-600/70 rounded font-bold text-lg hover:bg-gray-600 transition flex items-center gap-2">
              ➕ My List
            </button>
            <button className="px-8 py-4 bg-gray-600/70 rounded font-bold text-lg hover:bg-gray-600 transition flex items-center gap-2">
              👍 Like
            </button>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-700">
            <h3 className="text-xl font-bold mb-4">More Info</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Language:</span>
                <span className="ml-2 text-white">{movie.original_language?.toUpperCase()}</span>
              </div>
              <div>
                <span className="text-gray-500">Release:</span>
                <span className="ml-2 text-white">{movie.release_date}</span>
              </div>
              <div>
                <span className="text-gray-500">Rating:</span>
                <span className="ml-2 text-white">{movie.rating}/10</span>
              </div>
              <div>
                <span className="text-gray-500">Votes:</span>
                <span className="ml-2 text-white">{movie.vote_count}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
