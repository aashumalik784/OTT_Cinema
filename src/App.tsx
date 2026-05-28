import { useState, useEffect, useCallback, useRef } from 'react'

// ============================================
// TMDB API Configuration
// ============================================
const TMDB_API_KEY = "804cc52037a36773e1da4c399ce3dc72"
const TMDB_BASE_URL = "https://api.themoviedb.org/3"
const IMG_URL = "https://image.tmdb.org/t/p/w500"
const BACKDROP_URL = "https://image.tmdb.org/t/p/original"

// ============================================
// Genre Mapping
// ============================================
const GENRE_MAP = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
  14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
  9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie",
  53: "Thriller", 10752: "War", 37: "Western"
}

// ============================================
// FREE Watch Providers (India)
// ============================================
const FREE_PROVIDER_IDS = [739, 125, 217, 612, 67] // YouTube, MX Player, JioCinema, Shemaroo, Ultra

// ============================================
// Language Mapping
// ============================================
const getLanguageName = (code) => {
  const languages = {
    "hi": "हिंदी", "en": "English", "te": "तेलुगु", "ta": "तमिल",
    "ml": "मलयालम", "kn": "कन्नड़", "bn": "बंगाली", "mr": "मराठी",
    "pa": "पंजाबी", "ur": "उर्दू", "fr": "French", "es": "Spanish",
    "ja": "Japanese", "ko": "Korean", "zh": "Chinese"
  }
  return languages[code] || code.toUpperCase()
}

// ============================================
// Helper Functions
// ============================================
const getGenreString = (genreIds) => {
  if (!genreIds || genreIds.length === 0) return "General"
  const genres = genreIds.slice(0, 2).map(id => GENRE_MAP[id] || "Unknown")
  return genres.join(", ")
}

const formatYear = (dateString) => {
  if (!dateString) return "N/A"
  return dateString.split("-")[0]
}

// Check YouTube videos for a movie
const checkYouTubeVideos = async (movieId) => {
  try {
    const url = `${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}&language=en-US`
    const response = await fetch(url)
    const data = await response.json()
    
    if (data.results && data.results.length > 0) {
      const trailer = data.results.find(v => v.type === "Trailer" && v.site === "YouTube")
      const teaser = data.results.find(v => v.type === "Teaser" && v.site === "YouTube")
      const anyVideo = data.results.find(v => v.site === "YouTube")
      const video = trailer || teaser || anyVideo
      return video ? video.key : null
    }
    return null
  } catch (err) {
    return null
  }
}

// Fetch free movies from TMDB
const fetchFreeMovies = async (page = 1, onProgress) => {
  const results = []
  
  try {
    // Get popular movies first
    const url = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
    const response = await fetch(url)
    const data = await response.json()
    
    if (!data.results) return { movies: [], totalPages: 0 }
    
    let processed = 0
    const total = data.results.length
    
    for (const movie of data.results) {
      try {
        const youtubeId = await checkYouTubeVideos(movie.id)
        
        if (youtubeId) {
          results.push({
            id: movie.id,
            title: movie.title,
            year: formatYear(movie.release_date),
            genre: getGenreString(movie.genre_ids || []),
            rating: Math.round(movie.vote_average * 10) / 10,
            poster: movie.poster_path ? IMG_URL + movie.poster_path : "",
            backdrop: movie.backdrop_path ? BACKDROP_URL + movie.backdrop_path : movie.poster_path ? IMG_URL + movie.poster_path : "",
            desc: movie.overview || "इस मूवी के बारे में कोई जानकारी उपलब्ध नहीं है।",
            youtubeId: youtubeId,
            category: "Popular",
            language: getLanguageName(movie.original_language || "en"),
            duration: null,
            provider: "YouTube"
          })
        }
        
        processed++
        if (onProgress) onProgress((processed / total) * 100)
      } catch (err) {
        console.error(`Error processing movie ${movie.id}:`, err)
      }
    }
    
    return { movies: results, totalPages: data.total_pages }
  } catch (err) {
    console.error("Error fetching movies:", err)
    return { movies: [], totalPages: 0 }
  }
}

// Search movies
const searchMovies = async (query) => {
  if (!query.trim()) return []
  
  try {
    const url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(query)}`
    const response = await fetch(url)
    const data = await response.json()
    
    const results = []
    
    for (const movie of data.results || []) {
      const youtubeId = await checkYouTubeVideos(movie.id)
      
      if (youtubeId) {
        results.push({
          id: movie.id,
          title: movie.title,
          year: formatYear(movie.release_date),
          genre: getGenreString(movie.genre_ids || []),
          rating: Math.round(movie.vote_average * 10) / 10,
          poster: movie.poster_path ? IMG_URL + movie.poster_path : "",
          backdrop: movie.backdrop_path ? BACKDROP_URL + movie.backdrop_path : "",
          desc: movie.overview || "कोई जानकारी नहीं",
          youtubeId: youtubeId,
          category: "Search Result",
          language: getLanguageName(movie.original_language || "en"),
          duration: null,
          provider: "YouTube"
        })
      }
    }
    
    return results
  } catch (err) {
    console.error("Error searching:", err)
    return []
  }
}

// ============================================
// Main App Component
// ============================================
function App() {
  const [movies, setMovies] = useState([])
  const [filteredMovies, setFilteredMovies] = useState([])
  const [playingId, setPlayingId] = useState(null)
  const [banner, setBanner] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [error, setError] = useState(null)
  const [totalMovies, setTotalMovies] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [categories, setCategories] = useState(["All"])
  
  const observerRef = useRef(null)
  const loadMoreRef = useRef(null)

  // Load movies
  const loadMovies = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    setLoadingProgress(0)
    
    try {
      const { movies: newMovies, totalPages } = await fetchFreeMovies(1, setLoadingProgress)
      
      setMovies(newMovies)
      setFilteredMovies(newMovies)
      setTotalMovies(newMovies.length)
      
      if (newMovies.length > 0) {
        setBanner(newMovies[0])
      }
      
      const uniqueCategories = ["All", ...new Set(newMovies.map(m => m.category))]
      setCategories(uniqueCategories)
      setHasMore(currentPage < totalPages)
      
    } catch (err) {
      setError("मूवीज़ लोड करते समय समस्या आई।")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load more movies
  const loadMoreMovies = useCallback(async () => {
    if (isLoading || !hasMore) return
    
    setIsLoading(true)
    const nextPage = currentPage + 1
    
    try {
      const { movies: newMovies, totalPages } = await fetchFreeMovies(nextPage)
      
      if (newMovies.length > 0) {
        setMovies(prev => [...prev, ...newMovies])
        setFilteredMovies(prev => [...prev, ...newMovies])
        setCurrentPage(nextPage)
        setTotalMovies(prev => prev + newMovies.length)
        setHasMore(nextPage < totalPages)
      } else {
        setHasMore(false)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, hasMore, isLoading])

  // Infinite scroll observer
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect()
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMoreMovies()
        }
      },
      { threshold: 0.5 }
    )
    
    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }
    
    return () => {
      if (observerRef.current) observerRef.current.disconnect()
    }
  }, [hasMore, isLoading, loadMoreMovies])

  // Initial load
  useEffect(() => {
    loadMovies()
  }, [loadMovies])

  // Filter movies
  useEffect(() => {
    let filtered = [...movies]
    
    if (selectedCategory !== "All") {
      filtered = filtered.filter(movie => movie.category === selectedCategory)
    }
    
    if (search.trim()) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(movie => 
        movie.title.toLowerCase().includes(searchLower) ||
        movie.genre.toLowerCase().includes(searchLower) ||
        movie.language.toLowerCase().includes(searchLower)
      )
    }
    
    setFilteredMovies(filtered)
  }, [selectedCategory, search, movies])

  // Handle search
  const handleSearch = async (query) => {
    setSearch(query)
    
    if (query.trim() && query.length > 2) {
      setIsLoading(true)
      const searchResults = await searchMovies(query)
      if (searchResults.length > 0) {
        setFilteredMovies(searchResults)
      }
      setIsLoading(false)
    } else if (!query.trim()) {
      let filtered = [...movies]
      if (selectedCategory !== "All") {
        filtered = filtered.filter(m => m.category === selectedCategory)
      }
      setFilteredMovies(filtered)
    }
  }

  // Play movie
  const playMovie = (youtubeId) => {
    if (youtubeId) setPlayingId(youtubeId)
  }

  // Close player
  const closePlayer = () => {
    setPlayingId(null)
  }

  // Render YouTube Player
  const renderYouTubePlayer = () => {
    if (!playingId) return null
    
    return (
      <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center" onClick={closePlayer}>
        <div className="relative w-full max-w-6xl mx-4" onClick={e => e.stopPropagation()}>
          <button onClick={closePlayer} className="absolute -top-12 right-0 text-white text-xl hover:text-gray-300">
            ✕ बंद करें
          </button>
          <div className="relative pb-[56.25%] h-0">
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg shadow-2xl"
              src={`https://www.youtube.com/embed/${playingId}?autoplay=1&rel=0`}
              title="YouTube Player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    )
  }

  // Render Banner
  const renderBanner = () => {
    if (!banner) return null
    
    return (
      <div className="relative h-[75vh] min-h-[500px] mb-12">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${banner.backdrop || banner.poster})` }}>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>
        
        <div className="relative h-full flex items-center px-4 md:px-16 lg:px-24">
          <div className="max-w-3xl text-white">
            <div className="flex gap-2 mb-4">
              <span className="px-3 py-1 bg-red-600 rounded-full text-xs font-semibold">फ्री में देखें</span>
              <span className="px-3 py-1 bg-gray-700/80 rounded-full text-xs">⭐ {banner.rating}/10</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">{banner.title}</h1>
            
            <div className="flex flex-wrap gap-3 md:gap-6 mb-5 text-sm md:text-base text-gray-300">
              <span>📅 {banner.year}</span>
              <span>🎭 {banner.genre}</span>
              <span>🔊 {banner.language}</span>
            </div>
            
            <p className="text-gray-200 mb-6 line-clamp-3 max-w-2xl text-sm md:text-base">{banner.desc}</p>
            
            <div className="flex flex-wrap gap-4">
              <button onClick={() => playMovie(banner.youtubeId)} className="bg-white text-black px-6 md:px-8 py-2.5 md:py-3 rounded-md font-semibold hover:bg-gray-200 transition flex items-center gap-2">
                ▶ अभी देखें
              </button>
              <button onClick={() => window.open(`https://www.youtube.com/watch?v=${banner.youtubeId}`, '_blank')} className="bg-gray-700/80 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-md font-semibold hover:bg-gray-700 transition flex items-center gap-2">
                📺 YouTube पर देखें
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render Movie Card
  const renderMovieCard = (movie, index) => {
    return (
      <div key={`${movie.id}-${index}`} className="group relative bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer" onClick={() => playMovie(movie.youtubeId)}>
        <div className="relative">
          <img src={movie.poster} alt={movie.title} className="w-full h-64 md:h-80 object-cover" loading="lazy" />
          <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded-md text-xs font-semibold">⭐ {movie.rating}</div>
          <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-md text-xs">{movie.year}</div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
            <h3 className="text-white font-bold text-sm mb-1">{movie.title}</h3>
            <p className="text-gray-300 text-xs line-clamp-2">{movie.desc}</p>
            <button className="mt-2 bg-white text-black px-3 py-1 rounded-md text-xs font-semibold w-full">अभी देखें</button>
          </div>
        </div>
        <div className="p-2">
          <h3 className="text-white font-semibold text-sm truncate">{movie.title}</h3>
          <div className="text-xs text-gray-400 mt-1">{movie.genre.split(",")[0]} • {movie.language}</div>
        </div>
      </div>
    )
  }

  // Loading Skeleton
  const renderSkeleton = () => {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-lg overflow-hidden animate-pulse">
            <div className="w-full h-64 bg-gray-700"></div>
            <div className="p-3">
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Progress Bar
  const renderProgressBar = () => {
    if (!isLoading || loadingProgress === 0) return null
    
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <div className="h-1 bg-gray-800">
          <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${loadingProgress}%` }} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {renderProgressBar()}
      {renderYouTubePlayer()}
      {!isLoading && movies.length > 0 && renderBanner()}
      
      <div className="px-4 md:px-8 lg:px-16 pb-12">
        {/* Search Bar */}
        <div className="sticky top-0 z-30 bg-black/95 backdrop-blur-sm py-4 -mt-2 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
              {categories.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-full whitespace-nowrap transition text-sm md:text-base ${selectedCategory === cat ? 'bg-white text-black font-semibold' : 'bg-gray-800 text-white hover:bg-gray-700'}`}>
                  {cat === "All" ? "🎬 सभी" : cat}
                </button>
              ))}
            </div>
            
            <div className="relative w-full md:w-96">
              <input type="text" placeholder="🔍 मूवी ढूंढें..." value={search} onChange={(e) => handleSearch(e.target.value)} className="w-full px-4 py-2 rounded-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-white transition pr-10" />
              {search && <button onClick={() => handleSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">✕</button>}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center mb-6 text-sm text-gray-400">
          <span className="font-semibold text-white">{filteredMovies.length}</span>
          <span className="hidden md:block">कुल {totalMovies}+ मूवीज़ उपलब्ध</span>
        </div>

        {/* Movies Grid */}
        {isLoading && movies.length === 0 ? renderSkeleton() : filteredMovies.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎬</div>
            <p className="text-gray-400 text-lg">कोई मूवी नहीं मिली</p>
            <button onClick={() => { setSearch(""); setSelectedCategory("All"); }} className="mt-4 text-white underline text-sm">फ़िल्टर हटाएं</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {filteredMovies.map(renderMovieCard)}
            </div>
            
            <div ref={loadMoreRef} className="h-10 flex justify-center items-center py-8">
              {isLoading && movies.length > 0 && <div className="w-5 h-5 border-2 border-gray-500 border-t-white rounded-full animate-spin"></div>}
              {!hasMore && movies.length > 0 && <p className="text-gray-500 text-sm">✨ बस इतनी ही मूवीज़ हैं ✨</p>}
            </div>
          </>
        )}

        {error && (
          <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg">
            {error} <button onClick={() => setError(null)} className="ml-2">✕</button>
          </div>
        )}

        <footer className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>🎬 TMDB API से फ्री मूवीज़ | सारी मूवीज़ YouTube पर उपलब्ध</p>
          <p className="mt-2 text-xs">Powered by TMDB | कुल {totalMovies}+ मूवीज़</p>
        </footer>
      </div>
    </div>
  )
}

export default App
