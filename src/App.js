import { useState, useEffect, useCallback } from 'react'
import { getTrendingMovies, getMoviesByCategory } from './services/apiservice'

function App() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [playingId, setPlayingId] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState("trending")
  const [search, setSearch] = useState("")
  const [hasMore, setHasMore] = useState(true)

  const categories = [
    { id: "trending", name: "🔥 Trending" },
    { id: "popular", name: "⭐ Popular" },
    { id: "top_rated", name: "🏆 Top Rated" },
    { id: "upcoming", name: "🚀 Upcoming" }
  ]

  // Initial load + category change
  useEffect(() => {
    const fetchInitialMovies = async () => {
      setLoading(true)
      setPage(1)
      setMovies([])
      const data = await getMoviesByCategory(selectedCategory, 1)
      setMovies(data.movies)
      setTotalPages(data.totalPages)
      setHasMore(data.currentPage < data.totalPages)
      setLoading(false)
    }
    fetchInitialMovies()
  }, [selectedCategory])

  // Load more movies - 1000+ tak jayega
  const loadMoreMovies = useCallback(async () => {
    if (loadingMore || !hasMore) return
    
    setLoadingMore(true)
    const nextPage = page + 1
    const data = await getMoviesByCategory(selectedCategory, nextPage)
    
    setMovies(prev => [...prev, ...data.movies])
    setPage(nextPage)
    setHasMore(nextPage < data.totalPages && nextPage < 50) // TMDB max 500 pages, hum 50 tak limit kar rahe = 1000 movies
    setLoadingMore(false)
  }, [page, selectedCategory, loadingMore, hasMore])

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMoreMovies()
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loadMoreMovies])

  // Search filter
  const filteredMovies = search.trim() 
    ? movies.filter(m => m.title.toLowerCase().includes(search.toLowerCase()))
    : movies

  const bannerMovie = movies[0]

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-4">🎬 Loading 1000+ Movies...</div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* Video Player Modal */}
      {playingId && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center" onClick={() => setPlayingId(null)}>
          <div className="relative w-full max-w-5xl mx-4" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPlayingId(null)} className="absolute -top-12 right-0 text-white text-2xl bg-red-600 px-4 py-1 rounded-full hover:bg-red-700">✕ बंद करें</button>
            <div className="relative pb-[56.25%] h-0 bg-gray-900 rounded-xl">
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                YouTube ID: {playingId} - TMDB me trailer ID nahi milti, iske liye /videos API call karni padegi
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Banner */}
      {bannerMovie && (
        <div className="relative h-[70vh] min-h-[500px] bg-cover bg-center" style={{ backgroundImage: `url(${bannerMovie.backdrop_url})` }}>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          <div className="relative h-full flex items-center px-6 md:px-20">
            <div className="max-w-2xl">
              <div className="flex gap-2 mb-3 flex-wrap">
                <span className="px-3 py-1 bg-red-600 rounded-full text-sm">🎬 फ्री में देखें</span>
                <span className="px-3 py-1 bg-yellow-600 rounded-full text-sm">⭐ {bannerMovie.rating}/10</span>
                <span className="px-3 py-1 bg-blue-600 rounded-full text-sm">📅 {bannerMovie.year}</span>
              </div>
              <h1 className="text-4xl md:text-7xl font-bold mb-3">{bannerMovie.title}</h1>
              <div className="flex gap-4 text-gray-300 mb-4 text-sm md:text-base">
                <span>🔊 {bannerMovie.original_language?.toUpperCase()}</span>
                <span>👥 {bannerMovie.vote_count} votes</span>
              </div>
              <p className="text-gray-200 mb-6 line-clamp-3">{bannerMovie.overview}</p>
            </div>
          </div>
        </div>
      )}

      {/* Search & Categories */}
      <div className="sticky top-0 z-30 bg-black/95 backdrop-blur px-6 py-4 border-b border-gray-800">
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setSelectedCategory(cat.id)} 
              className={`px-4 py-2 rounded-full text-sm transition ${
                selectedCategory === cat.id 
                  ? 'bg-white text-black font-semibold' 
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <input 
          type="text" 
          placeholder="🔍 1000+ मूवीज़ में ढूंढें..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          className="w-full md:w-96 px-4 py-2 rounded-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-white" 
        />
      </div>

      {/* Movies Grid */}
      <div className="px-6 py-8">
        <h2 className="text-xl font-bold mb-5">
          {filteredMovies.length} मूवीज़ मिलीं 
          <span className="text-gray-500 text-sm ml-2">| Loaded: {movies.length}/1000+</span>
        </h2>
        
        {filteredMovies.length === 0 && !loading ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">कोई मूवी नहीं मिली</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredMovies.map(movie => (
                <div key={`${movie.id}-${Math.random()}`} className="bg-gray-900 rounded-xl overflow-hidden hover:scale-105 transition duration-300 cursor-pointer group">
                  <div className="relative">
                    <img 
                      src={movie.poster_url || "https://via.placeholder.com/500x750/111/white?text=No+Image"} 
                      alt={movie.title} 
                      className="w-full h-56 md:h-72 object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/500x750/111/white?text=No+Image"
                      }}
                    />
                    <div className="absolute top-2 left-2 bg-black/80 px-2 py-1 rounded-md text-xs font-bold">⭐ {movie.rating}</div>
                    <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded-md text-xs">{movie.year}</div>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <button className="bg-white text-black px-4 py-2 rounded-lg font-bold">▶ Play</button>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="text-white font-semibold truncate text-sm" title={movie.title}>{movie.title}</h3>
                    <div className="flex justify-between text-gray-400 text-xs mt-1">
                      <span>{movie.original_language?.toUpperCase()}</span>
                      <span>{movie.vote_count} votes</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Indicator */}
            {loadingMore && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                <p className="text-gray-400">Loading more movies...</p>
              </div>
            )}

            {!hasMore && movies.length > 0 && (
              <div className="text-center py-8 text-gray-500">
                🎉 Sab movies load ho gayi | Total: {movies.length}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm py-6 border-t border-gray-800">
        🎬 {movies.length}+ Movies Loaded | Infinite Scroll Active
        <br />
        <span className="text-xs text-gray-600">Data from TMDB API | Scroll down for more</span>
      </footer>
    </div>
  )
}

export default App
