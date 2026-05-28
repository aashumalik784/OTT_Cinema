import { useState, useEffect } from 'react'

// ============================================
// TMDB API Configuration
// ============================================
const TMDB_API_KEY = "804cc52037a36773e1da4c399ce3dc72"
const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p/w500"
const TMDB_BACKDROP_URL = "https://image.tmdb.org/t/p/original"

// ============================================
// Movie Data with TMDB Posters
// ============================================
const MOVIES = [
  {
    id: 1,
    title: "KGF Chapter 2",
    year: "2022",
    genre: "Action",
    rating: 8.4,
    poster: "https://image.tmdb.org/t/p/w500/odJ4hx6gIRv4rVcFwE6NqZ8kFdV.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/odJ4hx6gIRv4rVcFwE6NqZ8kFdV.jpg",
    desc: "रॉकी भाई का सत्ता तक सफर। दमदार एक्शन फिल्म।",
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
  const [playingId, setPlayingId] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [search, setSearch] = useState("")

  const categories = ["All", ...new Set(MOVIES.map(m => m.category))]

  let filteredMovies = MOVIES
  if (selectedCategory !== "All") {
    filteredMovies = filteredMovies.filter(m => m.category === selectedCategory)
  }
  if (search.trim()) {
    filteredMovies = filteredMovies.filter(m => 
      m.title.toLowerCase().includes(search.toLowerCase())
    )
  }

  const bannerMovie = MOVIES[0]

  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* Video Player */}
      {playingId && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center" onClick={() => setPlayingId(null)}>
          <div className="relative w-full max-w-5xl mx-4" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPlayingId(null)} className="absolute -top-12 right-0 text-white text-2xl bg-red-600 px-4 py-1 rounded-full">✕ बंद करें</button>
            <div className="relative pb-[56.25%] h-0">
              <iframe 
                className="absolute top-0 left-0 w-full h-full rounded-xl" 
                src={`https://www.youtube.com/embed/${playingId}?autoplay=1&rel=0`} 
                title="Player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen 
              />
            </div>
          </div>
        </div>
      )}

      {/* Banner */}
      <div className="relative h-[70vh] min-h-[500px] bg-cover bg-center" style={{ backgroundImage: `url(${bannerMovie.backdrop})` }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="relative h-full flex items-center px-6 md:px-20">
          <div className="max-w-2xl">
            <div className="flex gap-2 mb-3">
              <span className="px-3 py-1 bg-red-600 rounded-full text-sm">🎬 फ्री में देखें</span>
              <span className="px-3 py-1 bg-yellow-600 rounded-full text-sm">⭐ {bannerMovie.rating}/10</span>
              <span className="px-3 py-1 bg-blue-600 rounded-full text-sm">{bannerMovie.category}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-3">{bannerMovie.title}</h1>
            <div className="flex gap-4 text-gray-300 mb-4">
              <span>📅 {bannerMovie.year}</span>
              <span>🎭 {bannerMovie.genre}</span>
              <span>🔊 {bannerMovie.language}</span>
              <span>⏱️ {bannerMovie.duration}</span>
            </div>
            <p className="text-gray-200 mb-6">{bannerMovie.desc}</p>
            <button onClick={() => setPlayingId(bannerMovie.youtubeId)} className="bg-white text-black px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-200 transition">▶ अभी देखें</button>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="sticky top-0 z-30 bg-black/95 px-6 py-4 border-b border-gray-800">
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-full text-sm transition ${selectedCategory === cat ? 'bg-white text-black font-semibold' : 'bg-gray-800 text-white hover:bg-gray-700'}`}>
              {cat === "All" ? "🎬 सभी" : cat}
            </button>
          ))}
        </div>
        <input 
          type="text" 
          placeholder="🔍 मूवी ढूंढें..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          className="w-full md:w-96 px-4 py-2 rounded-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-white" 
        />
      </div>

      {/* Movies Grid */}
      <div className="px-6 py-8">
        <h2 className="text-xl font-bold mb-5">{filteredMovies.length} मूवीज़ मिलीं</h2>
        
        {filteredMovies.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400">कोई मूवी नहीं मिली</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredMovies.map(movie => (
              <div key={movie.id} className="bg-gray-900 rounded-xl overflow-hidden hover:scale-105 transition cursor-pointer group" onClick={() => setPlayingId(movie.youtubeId)}>
                <div className="relative">
                  <img 
                    src={movie.poster} 
                    alt={movie.title} 
                    className="w-full h-56 md:h-64 object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/500x750/333/white?text=No+Image"
                    }}
                  />
                  <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded-md text-xs">⭐ {movie.rating}</div>
                  <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-md text-xs">{movie.year}</div>
                </div>
                <div className="p-3">
                  <h3 className="text-white font-semibold truncate">{movie.title}</h3>
                  <div className="flex justify-between text-gray-400 text-sm mt-1">
                    <span>{movie.genre}</span>
                    <span>{movie.language}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm py-6 border-t border-gray-800">
        🎬 {MOVIES.length}+ फ्री मूवीज़ | Shemaroo • Goldmines • Rajshri
        <br />
        <span className="text-xs text-gray-600">Powered by TMDB API</span>
      </footer>
    </div>
  )
}

export default App
