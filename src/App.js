import { useState, useEffect, useCallback } from 'react'
import { getMovies } from './services/apiservice'

function App() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [search, setSearch] = useState("")

  // Pehli baar load
  useEffect(() => {
    const fetchInitial = async () => {
      setLoading(true)
      const data = await getMovies(1)
      setMovies(data.movies)
      setHasMore(data.currentPage < data.totalPages && data.currentPage < 50)
      setLoading(false)
    }
    fetchInitial()
  }, [])

  // Load more - 50 pages = 1000 movies
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return
    
    setLoadingMore(true)
    const nextPage = page + 1
    const data = await getMovies(nextPage)
    
    setMovies(prev => [...prev,...data.movies])
    setPage(nextPage)
    setHasMore(nextPage < data.totalPages && nextPage < 50)
    setLoadingMore(false)
  }, [page, loadingMore, hasMore])

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 800) {
        loadMore()
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loadMore])

  const filteredMovies = search.trim() 
  ? movies.filter(m => m.title.toLowerCase().includes(search.toLowerCase()))
    : movies

  const bannerMovie = movies[0]

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-4">🎬 Loading Movies...</div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* Banner */}
      {bannerMovie && (
        <div className="relative h-96 md:h-[500px] bg-cover bg-center" style={{ backgroundImage: `url(${bannerMovie.backdrop_url})` }}>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          <div className="relative h-full flex items-center px-6 md:px-20">
            <div className="max-w-2xl">
              <div className="flex gap-2 mb-3 flex-wrap">
                <span className="px-3 py-1 bg-red-600 rounded-full text-sm">🎬 Trending</span>
                <span className="px-3 py-1 bg-yellow-600 rounded-full text-sm">⭐ {bannerMovie.rating}/10</span>
                <span className="px-3 py-1 bg-blue-600 rounded-full text-sm">📅 {bannerMovie.year}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-3">{bannerMovie.title}</h1>
              <p className="text-gray-200 mb-6 line-clamp-3">{bannerMovie.overview}</p>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="sticky top-0 z-30 bg-black/95 backdrop-blur px-6 py-4 border-b border-gray-800">
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
          {filteredMovies.length} मूवीज़ 
          <span className="text-gray-500 text-sm ml-2">| Loaded: {movies.length}/1000+</span>
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredMovies.map((movie, idx) => (
            <div key={`${movie.id}-${idx}`} className="bg-gray-900 rounded-xl overflow-hidden hover:scale-105 transition duration-300 cursor-pointer">
              <div className="relative">
                <img 
                  src={movie.poster_url || "https://via.placeholder.com/500x750/111/white?text=No+Image"} 
                  alt={movie.title} 
                  className="w-full h-56 md:h-72 object-cover"
                  loading="lazy"
                />
                <div className="absolute top-2 left-2 bg-black/80 px-2 py-1 rounded-md text-xs font-bold">⭐ {movie.rating}</div>
                <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded-md text-xs">{movie.year}</div>
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
      </div>

      <footer className="text-center text-gray-500 text-sm py-6 border-t border-gray-800">
        🎬 {movies.length}+ Movies | Powered by TMDB
      </footer>
    </div>
  )
}

export default App
