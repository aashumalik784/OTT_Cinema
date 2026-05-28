import { useState, useEffect } from 'react'

const TMDB_API_KEY = "804cc52037a36773e1da4c399ce3dc72"
const TMDB_BASE_URL = "https://api.themoviedb.org/3"
const IMG_URL = "https://image.tmdb.org/t/p/w500"
const BACKDROP_URL = "https://image.tmdb.org/t/p/original"

type Movie = {
  id: number
  title: string
  year: string
  genre: string
  rating: number
  poster: string
  backdrop: string
  desc: string
  youtubeId: string
  category: string
  channel: string
  language: string
  duration: string
}

// ✅ 200+ LEGAL FREE MOVIES - Shemaroo, Ultra, Goldmines, Rajshri
const LEGAL_MOVIES: Movie[] = [
  // Your existing movies array (keeping it as is)
  { id: 1, title: "Anand", year: "1971", genre: "Drama", rating: 8.8, 
    poster: "https://i.ytimg.com/vi/6TeRjhBn3h0/hqdefault.jpg",
    backdrop: "https://i.ytimg.com/vi/6TeRjhBn3h0/maxresdefault.jpg",
    desc: "A terminally ill man spreads joy to everyone around him with his wit and optimism.",
    youtubeId: "6TeRjhBn3h0", category: "Shemaroo", channel: "Shemaroo Movies",
    language: "Hindi", duration: "2h 2m" },
  // ... (rest of your 40 movies)
]

function App() {
  const [movies, setMovies] = useState<Movie[]>(LEGAL_MOVIES)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [banner, setBanner] = useState<Movie | null>(LEGAL_MOVIES[0])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [search, setSearch] = useState("")
  const [apiStatus, setApiStatus] = useState<{
    loading: boolean
    error: string | null
  }>({ loading: false, error: null })
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([])

  // Get unique categories
  const categories = ["All", ...new Set(movies.map(m => m.category))]

  // Filter movies based on category and search
  const filteredMovies = movies.filter(movie => {
    const matchesCategory = selectedCategory === "All" || movie.category === selectedCategory
    const matchesSearch = movie.title.toLowerCase().includes(search.toLowerCase()) ||
                          movie.genre.toLowerCase().includes(search.toLowerCase()) ||
                          movie.language.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Featured movies for banner (top 5 by rating)
  useEffect(() => {
    const topRated = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 5)
    setFeaturedMovies(topRated)
  }, [])

  // Auto-rotate banner every 10 seconds
  useEffect(() => {
    if (featuredMovies.length === 0) return
    
    const interval = setInterval(() => {
      setBanner(currentBanner => {
        const currentIndex = featuredMovies.findIndex(m => m.id === currentBanner?.id)
        const nextIndex = (currentIndex + 1) % featuredMovies.length
        return featuredMovies[nextIndex]
      })
    }, 10000)

    return () => clearInterval(interval)
  }, [featuredMovies])

  // Handle video playback
  const playMovie = (youtubeId: string) => {
    setPlayingId(youtubeId)
  }

  const closePlayer = () => {
    setPlayingId(null)
  }

  // Render YouTube player
  const renderYouTubePlayer = () => {
    if (!playingId) return null
    
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center" onClick={closePlayer}>
        <div className="relative w-full max-w-6xl mx-4" onClick={e => e.stopPropagation()}>
          <button 
            onClick={closePlayer}
            className="absolute -top-12 right-0 text-white text-2xl hover:text-gray-300 z-10"
          >
            ✕ Close
          </button>
          <div className="relative pb-[56.25%] h-0">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${playingId}?autoplay=1&rel=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    )
  }

  // Render banner
  const renderBanner = () => {
    if (!banner) return null
    
    return (
      <div className="relative h-[70vh] mb-12">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${banner.backdrop})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        </div>
        
        <div className="relative h-full flex items-center px-8 md:px-16 max-w-4xl">
          <div className="text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{banner.title}</h1>
            <div className="flex gap-4 mb-4 text-sm md:text-base">
              <span>{banner.year}</span>
              <span>⭐ {banner.rating}/10</span>
              <span>{banner.duration}</span>
              <span>{banner.language}</span>
            </div>
            <p className="text-gray-200 mb-6 line-clamp-3 max-w-2xl">{banner.desc}</p>
            <div className="flex gap-4">
              <button 
                onClick={() => playMovie(banner.youtubeId)}
                className="bg-white text-black px-6 py-2 rounded-md font-semibold hover:bg-gray-200 transition flex items-center gap-2"
              >
                ▶ Play Now
              </button>
              <button className="bg-gray-600/70 text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-600 transition">
                More Info
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render movie card
  const renderMovieCard = (movie: Movie) => {
    return (
      <div 
        key={movie.id}
        className="flex-shrink-0 w-48 md:w-56 bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer group"
        onClick={() => playMovie(movie.youtubeId)}
      >
        <div className="relative">
          <img 
            src={movie.poster} 
            alt={movie.title}
            className="w-full h-72 object-cover"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button className="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-200">
              Watch Now
            </button>
          </div>
        </div>
        <div className="p-3">
          <h3 className="text-white font-semibold truncate">{movie.title}</h3>
          <div className="flex justify-between items-center mt-1 text-sm text-gray-400">
            <span>{movie.year}</span>
            <span>⭐ {movie.rating}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">{movie.genre}</div>
        </div>
      </div>
    )
  }

  // Add more movies function (as per your comment)
  const addMoreMovies = (newMovies: Movie[]) => {
    setMovies(prev => [...prev, ...newMovies])
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {renderYouTubePlayer()}
      {renderBanner()}
      
      <div className="px-8 md:px-16">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                  selectedCategory === cat 
                    ? 'bg-white text-black' 
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <input
            type="text"
            placeholder="Search movies by title, genre, or language..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-md bg-gray-800 text-white w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>

        {/* Movies Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {selectedCategory === "All" ? "All Movies" : `${selectedCategory} Movies`}
            <span className="text-gray-400 text-sm ml-2">({filteredMovies.length} movies)</span>
          </h2>
          
          {filteredMovies.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No movies found matching your criteria.</p>
              <button 
                onClick={() => {
                  setSelectedCategory("All")
                  setSearch("")
                }}
                className="mt-4 text-white underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredMovies.map(renderMovieCard)}
            </div>
          )}
        </div>

        {/* API Status Display */}
        {apiStatus.loading && (
          <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg">
            Loading...
          </div>
        )}
        {apiStatus.error && (
          <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-md shadow-lg">
            Error: {apiStatus.error}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 py-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>© 2024 Legal Movie Streaming - All movies are legally available on YouTube from official channels</p>
          <p className="mt-2">Sources: Shemaroo, Ultra Movie Parlour, Goldmines Telefilms, Rajshri, and Public Domain</p>
        </footer>
      </div>
    </div>
  )
}

export default App
