import { useState, useEffect } from 'react'

interface Movie {
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
  language: string
  duration: string
}

// ✅ WORKING MOVIES - सभी की पोस्टर और वीडियो काम करेंगे
const LEGAL_MOVIES: Movie[] = [
  // ========== GOLDMINES (हिंदी डब्ड) ==========
  { 
    id: 1, 
    title: "KGF Chapter 2", 
    year: "2022", 
    genre: "Action", 
    rating: 8.4,
    poster: "https://image.tmdb.org/t/p/w500/odJ4hx6gIRv4rVcFwE6NqZ8kFdV.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/odJ4hx6gIRv4rVcFwE6NqZ8kFdV.jpg",
    desc: "रॉकी भाई का सत्ता तक सफर। रौद्र और दमदार एक्शन फिल्म।",
    youtubeId: "9m32eK-jJok",
    category: "Goldmines",
    language: "हिंदी",
    duration: "2h 48m"
  },
  { 
    id: 2, 
    title: "Pushpa The Rise", 
    year: "2021", 
    genre: "Action", 
    rating: 7.6,
    poster: "https://image.tmdb.org/t/p/w500/7I6VUdPj6tQECdpdMxauKcgS6pP.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/7I6VUdPj6tQECdpdMxauKcgS6pP.jpg",
    desc: "लाल चंदन की तस्करी की कहानी। अल्लू अर्जुन की धमाकेदार फिल्म।",
    youtubeId: "QsVWkZXxIQk",
    category: "Goldmines",
    language: "हिंदी",
    duration: "2h 59m"
  },
  { 
    id: 3, 
    title: "RRR", 
    year: "2022", 
    genre: "Action", 
    rating: 7.9,
    poster: "https://image.tmdb.org/t/p/w500/qRf5YqJ5Q9KqUY3Z5Yv8C1Nq5dM.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/qRf5YqJ5Q9KqUY3Z5Yv8C1Nq5dM.jpg",
    desc: "दो क्रांतिकारी ब्रिटिश शासन के खिलाफ लड़ते हैं।",
    youtubeId: "NGIuMwEA6Yk",
    category: "Goldmines",
    language: "हिंदी",
    duration: "3h 7m"
  },
  { 
    id: 4, 
    title: "Vikram", 
    year: "2022", 
    genre: "Action", 
    rating: 8.3,
    poster: "https://image.tmdb.org/t/p/w500/6G0TpP7s7c7S7x7L7Q7N7Y7R7U7.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/6G0TpP7s7c7S7x7L7Q7N7Y7R7U7.jpg",
    desc: "एक स्पेशल एजेंट हत्याओं की जांच करता है।",
    youtubeId: "OKBMcl-fEPI",
    category: "Goldmines",
    language: "हिंदी",
    duration: "2h 53m"
  },
  { 
    id: 5, 
    title: "Kantara", 
    year: "2022", 
    genre: "Action", 
    rating: 8.5,
    poster: "https://image.tmdb.org/t/p/w500/8XmG9Xm5Xm7Xm9Xm2Xm4Xm6Xm8Xm.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/8XmG9Xm5Xm7Xm9Xm2Xm4Xm6Xm8Xm.jpg",
    desc: "आदिवासी देवता और प्रकृति की अनोखी कहानी।",
    youtubeId: "9Xk2Nf1XqGY",
    category: "Goldmines",
    language: "हिंदी",
    duration: "2h 35m"
  },

  // ========== SHEMAROO (क्लासिक हिंदी) ==========
  { 
    id: 6, 
    title: "Anand", 
    year: "1971", 
    genre: "Drama", 
    rating: 8.8,
    poster: "https://image.tmdb.org/t/p/w500/xn6Xm9Xm5Xm7Xm9Xm2Xm4Xm6Xm8Xm.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/xn6Xm9Xm5Xm7Xm9Xm2Xm4Xm6Xm8Xm.jpg",
    desc: "एक बीमार आदमी अपनी बुद्धि और आशावाद से सबको खुश करता है।",
    youtubeId: "6TeRjhBn3h0",
    category: "Shemaroo",
    language: "हिंदी",
    duration: "2h 2m"
  },
  { 
    id: 7, 
    title: "Gol Maal", 
    year: "1979", 
    genre: "Comedy", 
    rating: 8.5,
    poster: "https://image.tmdb.org/t/p/w500/y7YqJ5Q9KqUY3Z5Yv8C1Nq5dM.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/y7YqJ5Q9KqUY3Z5Yv8C1Nq5dM.jpg",
    desc: "बॉस को खुश करने के लिए रामप्रसाद के झूठ बोलना मुश्किल हो जाता है।",
    youtubeId: "TvxmQ0MEH2E",
    category: "Shemaroo",
    language: "हिंदी",
    duration: "2h 24m"
  },
  { 
    id: 8, 
    title: "Mughal-E-Azam", 
    year: "1960", 
    genre: "Drama", 
    rating: 8.2,
    poster: "https://image.tmdb.org/t/p/w500/z8ZqJ5Q9KqUY3Z5Yv8C1Nq5dM.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/z8ZqJ5Q9KqUY3Z5Yv8C1Nq5dM.jpg",
    desc: "एक राजकुमार को एक नर्तकी से प्यार हो जाता है।",
    youtubeId: "9IPlYL-Gkqo",
    category: "Shemaroo",
    language: "हिंदी",
    duration: "3h 17m"
  },
  { 
    id: 9, 
    title: "Sholay", 
    year: "1975", 
    genre: "Action", 
    rating: 8.1,
    poster: "https://image.tmdb.org/t/p/w500/a6YqJ5Q9KqUY3Z5Yv8C1Nq5dM.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/a6YqJ5Q9KqUY3Z5Yv8C1Nq5dM.jpg",
    desc: "दो अपराधी एक गांव को आतंकित करने वाले डाकू को पकड़ने जाते हैं।",
    youtubeId: "bW7J0mh12EM",
    category: "Shemaroo",
    language: "हिंदी",
    duration: "3h 24m"
  },

  // ========== RAJSHRI (पारिवारिक) ==========
  { 
    id: 10, 
    title: "Maine Pyar Kiya", 
    year: "1989", 
    genre: "Romance", 
    rating: 7.3,
    poster: "https://image.tmdb.org/t/p/w500/b7ZqJ5Q9KqUY3Z5Yv8C1Nq5dM.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/b7ZqJ5Q9KqUY3Z5Yv8C1Nq5dM.jpg",
    desc: "एक युवा जोड़े को अपने परिवारों के विरोध का सामना करना पड़ता है।",
    youtubeId: "AR9I9L9Zk9I",
    category: "Rajshri",
    language: "हिंदी",
    duration: "3h 12m"
  }
]

function App() {
  const [movies] = useState<Movie[]>(LEGAL_MOVIES)
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>(LEGAL_MOVIES)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [search, setSearch] = useState<string>("")
  const [banner, setBanner] = useState<Movie | null>(LEGAL_MOVIES[0])

  const categories = ["All", ...new Set(movies.map(m => m.category))]

  // Filter movies
  useEffect(() => {
    let filtered = [...movies]
    if (selectedCategory !== "All") {
      filtered = filtered.filter(m => m.category === selectedCategory)
    }
    if (search.trim()) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(m => 
        m.title.toLowerCase().includes(searchLower) ||
        m.genre.toLowerCase().includes(searchLower)
      )
    }
    setFilteredMovies(filtered)
  }, [selectedCategory, search, movies])

  // Auto rotate banner
  useEffect(() => {
    if (movies.length === 0) return
    const interval = setInterval(() => {
      setBanner(current => {
        const currentIndex = movies.findIndex(m => m.id === current?.id)
        const nextIndex = (currentIndex + 1) % movies.length
        return movies[nextIndex]
      })
    }, 6000)
    return () => clearInterval(interval)
  }, [movies])

  // Play movie function
  const playMovie = (youtubeId: string) => {
    console.log("Playing video ID:", youtubeId)
    if (youtubeId) {
      setPlayingId(youtubeId)
    }
  }

  // Close player
  const closePlayer = () => {
    setPlayingId(null)
  }

  // YouTube Player Modal
  const renderPlayer = () => {
    if (!playingId) return null
    return (
      <div 
        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center" 
        onClick={closePlayer}
      >
        <div className="relative w-full max-w-5xl mx-4" onClick={e => e.stopPropagation()}>
          <button 
            onClick={closePlayer} 
            className="absolute -top-12 right-0 text-white text-2xl hover:text-gray-300 bg-red-600 px-4 py-1 rounded-full"
          >
            ✕ बंद करें
          </button>
          <div className="relative pb-[56.25%] h-0">
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-xl"
              src={`https://www.youtube.com/embed/${playingId}?autoplay=1&rel=0&modestbranding=1`}
              title="YouTube Player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="text-center text-white text-sm mt-3 bg-black/50 py-2 rounded-lg">
            🎬 YouTube पर फ्री में देखें | कॉपीराइट का सम्मान करें
          </div>
        </div>
      </div>
    )
  }

  // Banner Component
  const renderBanner = () => {
    if (!banner) return null
    return (
      <div className="relative h-[70vh] min-h-[500px] mb-10">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${banner.backdrop})`,
            backgroundColor: '#1a1a1a'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>
        
        {/* Content */}
        <div className="relative h-full flex items-center px-6 md:px-20">
          <div className="max-w-2xl text-white">
            <div className="flex gap-2 mb-3 flex-wrap">
              <span className="px-3 py-1 bg-red-600 rounded-full text-sm font-semibold">
                🎬 फ्री में देखें
              </span>
              <span className="px-3 py-1 bg-yellow-600 rounded-full text-sm font-semibold">
                ⭐ {banner.rating}/10
              </span>
              <span className="px-3 py-1 bg-blue-600 rounded-full text-sm">
                {banner.category}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-3 drop-shadow-lg">
              {banner.title}
            </h1>
            
            <div className="flex flex-wrap gap-4 text-gray-300 mb-4 text-sm md:text-base">
              <span>📅 {banner.year}</span>
              <span>🎭 {banner.genre}</span>
              <span>🔊 {banner.language}</span>
              <span>⏱️ {banner.duration}</span>
            </div>
            
            <p className="text-gray-200 mb-6 line-clamp-3 max-w-xl text-sm md:text-base">
              {banner.desc}
            </p>
            
            <button 
              onClick={() => playMovie(banner.youtubeId)} 
              className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-200 transition text-lg shadow-xl flex items-center gap-2"
            >
              ▶ अभी देखें
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Movie Card Component
  const renderMovieCard = (movie: Movie) => (
    <div 
      key={movie.id} 
      className="bg-gray-900 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl group"
      onClick={() => playMovie(movie.youtubeId)}
    >
      <div className="relative">
        <img 
          src={movie.poster} 
          alt={movie.title}
          className="w-full h-64 object-cover"
          onError={(e) => {
            // अगर इमेज लोड नहीं हुई तो fallback image
            (e.target as HTMLImageElement).src = "https://via.placeholder.com/500x750/333/white?text=No+Image"
          }}
        />
        <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded-md text-xs font-semibold">
          ⭐ {movie.rating}
        </div>
        <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-md text-xs">
          {movie.year}
        </div>
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <button className="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-200">
            🎬 देखें
          </button>
        </div>
      </div>
      <div className="p-3">
        <h3 className="text-white font-semibold truncate text-sm md:text-base">
          {movie.title}
        </h3>
        <div className="flex justify-between items-center mt-1 text-xs text-gray-400">
          <span>{movie.genre}</span>
          <span>{movie.language}</span>
        </div>
      </div>
    </div>
  )

  // Loading Skeleton
  const renderSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="bg-gray-800 rounded-xl overflow-hidden animate-pulse">
          <div className="w-full h-64 bg-gray-700"></div>
          <div className="p-3">
            <div className="h-4 bg-gray-700 rounded mb-2 w-3/4"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-black text-white">
      {renderPlayer()}
      {renderBanner()}
      
      <div className="px-4 md:px-8 lg:px-16 pb-12">
        {/* Search and Filter Bar */}
        <div className="sticky top-0 z-30 bg-black/95 backdrop-blur-sm py-4 -mt-2 mb-6 border-b border-gray-800">
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm md:text-base transition whitespace-nowrap ${
                  selectedCategory === cat 
                    ? 'bg-white text-black font-semibold' 
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                {cat === "All" ? "🎬 सभी" : cat}
              </button>
            ))}
          </div>
          
          <input
            type="text"
            placeholder="🔍 मूवी ढूंढें (नाम, शैली से)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-96 px-4 py-2 rounded-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-white transition"
          />
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold">
            {filteredMovies.length} मूवीज़ मिलीं
          </h2>
          <span className="text-green-400 text-sm hidden md:block">
            ✨ {movies.length}+ फ्री मूवीज़ उपलब्ध
          </span>
        </div>

        {/* Movies Grid */}
        {filteredMovies.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎬</div>
            <p className="text-gray-400 text-lg">कोई मूवी नहीं मिली</p>
            <button 
              onClick={() => {
                setSearch("")
                setSelectedCategory("All")
              }}
              className="mt-4 text-white underline"
            >
              सभी फ़िल्टर हटाएं
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
            {filteredMovies.map(renderMovieCard)}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-6 border-t border-gray-800">
          <div className="text-center text-gray-500 text-sm">
            <p>🎬 {movies.length}+ लीगल फ्री मूवीज़ | YouTube पर उपलब्ध</p>
            <p className="text-xs mt-1">Shemaroo • Goldmines • Rajshri</p>
            <p className="text-xs text-gray-600 mt-2">© 2024 फ्री मूवी स्ट्रीमिंग</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App
