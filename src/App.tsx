import { useState, useEffect } from 'react'

// तेरी TMDB API Key - AdSense नहीं लगाना
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
  youtubeId?: string
  language: string
  duration: string
}

// Free Legal Bollywood Movies - YouTube IDs from Shemaroo/Ultra
const freeYouTubeIds: {[key: number]: string} = {
  19404: "6TeRjhBn3h0",   // Anand 1971
  788: "TvxmQ0MEH2E",     // Gol Maal 1979  
  109428: "uVYcKZYnC5Q",  // Chupke Chupke 1975
  278: "K4krT7atyIs",     // Pyaasa 1957
  667: "6EH6phlJgJE",     // Mother India 1957
  9469: "9IPlYL-Gkqo",    // Mughal-E-Azam 1960
  105: "bW7J0mh12EM",     // Sholay 1975
  378176: "7YQymLqE_pY",  // Guide 1965
  111977: "sJbV-yS-G2s",  // Madhumati 1958
  688: "O1y6O3bKxwQ",     // Kagaz Ke Phool 1959
}

function App() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [banner, setBanner] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedGenre, setSelectedGenre] = useState("All")
  const [search, setSearch] = useState("")
  const [myList, setMyList] = useState<number[]>([])

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const classicIds = [19404, 788, 109428, 278, 667, 9469, 105, 378176, 111977, 688]
        const moviePromises = classicIds.map(id => 
          fetch(`${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}`)
            .then(res => res.json())
        )
        
        const moviesData = await Promise.all(moviePromises)
        
        const formatted: Movie[] = moviesData.map((m: any) => ({
          id: m.id,
          title: m.title,
          year: m.release_date?.split('-')[0] || 'N/A',
          genre: m.genres?.[0]?.name || 'Classic',
          rating: m.vote_average ? m.vote_average.toFixed(1) : 'N/A',
          poster: m.poster_path ? `${IMG_URL}${m.poster_path}` : '',
          backdrop: m.backdrop_path ? `${BACKDROP_URL}${m.backdrop_path}` : '',
          desc: m.overview || 'No description available',
          youtubeId: freeYouTubeIds[m.id],
          language: "Hindi",
          duration: m.runtime ? `${Math.floor(m.runtime/60)}h ${m.runtime%60}m` : '2h 30m'
        }))
        
        setMovies(formatted)
        setBanner(formatted[0])
        setLoading(false)
      } catch (error) {
        console.error("TMDB Error:", error)
        setLoading(false)
      }
    }
    fetchMovies()
  }, [])

  const genres = ["All", "Drama", "Comedy", "Romance", "Action", "Classic"]
  
  const filtered = movies.filter(m => 
    (selectedGenre === "All" || m.genre === selectedGenre) &&
    m.title.toLowerCase().includes(search.toLowerCase())
  )

  const toggleList = (id: number) => {
    setMyList(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  if (loading) return <div className="loading">Loading Classic Movies...</div>

  return (
    <div className="app">
      {playingId && (
        <div className="video-modal" onClick={() => setPlayingId(null)}>
          <div className="video-container" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setPlayingId(null)}>✕</button>
            <iframe 
              src={`https://www.youtube.com/embed/${playingId}?autoplay=1&rel=0`} 
              width="100%" height="100%" frameBorder="0" 
              allow="autoplay; encrypted-media; fullscreen" allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      <nav className="navbar">
        <h1 className="logo"><span className="logo-c">C</span>INEMA</h1>
        <div className="nav-icons"><span>🔍</span><span>👤</span></div>
      </nav>

      {banner && (
        <header className="banner" style={{backgroundImage: `url(${banner.backdrop})`}}>
          <div className="banner-content">
            <div className="tags">
              <span className="tag-trending">🔥 100% FREE</span>
              <span className="tag-rating">★ {banner.rating}</span>
            </div>
            <h1 className="banner-title">{banner.title}</h1>
            <p className="banner-info">{banner.year} • {banner.duration} • {banner.language}</p>
            <p className="banner-genre">{banner.genre}</p>
            <p className="banner-desc">{banner.desc}</p>
            <div className="banner-buttons">
              {banner.youtubeId && (
                <button className="play-btn" onClick={() => setPlayingId(banner.youtubeId)}>▶ Play Free Now</button>
              )}
              <button className="list-btn" onClick={() => toggleList(banner.id)}>
                {myList.includes(banner.id) ? '✓ My List' : '+ My List'}
              </button>
            </div>
          </div>
        </header>
      )}

      <div className="search-bar">
        <input type="text" placeholder="Search classic movies..." value={search} 
          onChange={e => setSearch(e.target.value)} className="search-input" />
      </div>

      <div className="categories">
        {genres.map(g => (
          <button key={g} className={`cat-btn ${selectedGenre === g ? 'active' : ''}`} 
            onClick={() => setSelectedGenre(g)}>{g}</button>
        ))}
      </div>

      <div className="row">
        <h2>🎬 Bollywood Classics ({filtered.length} Movies)</h2>
        <div className="row-posters">
          {filtered.map(movie => (
            <div key={movie.id} className="movie-card">
              <div className="poster-wrapper" onClick={() => movie.youtubeId && setPlayingId(movie.youtubeId)}>
                <img src={movie.poster} alt={movie.title} className="poster" loading="lazy" />
                <div className="rating-badge">{movie.youtubeId ? 'FREE HD' : 'Coming Soon'}</div>
                {movie.youtubeId && <div className="play-overlay">▶</div>}
              </div>
              <h3>{movie.title}</h3>
              <p>{movie.year} • {movie.genre}</p>
              <button className="add-list-btn" onClick={e => {e.stopPropagation(); toggleList(movie.id)}}>
                {myList.includes(movie.id) ? '✓ Added' : '+ List'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="row legal-row">
        <h2>⚖️ Personal Project - Powered by TMDB</h2>
        <div className="legal-box">
          <p>✅ Movie data from TMDB API</p>
          <p>✅ Videos from YouTube Official Channels</p>
          <p>✅ Non-Commercial Use Only</p>
        </div>
      </div>

      <div className="tmdb-credit">
        <p>Movie data provided by 
          <img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a049c70e9558ef1e01d8d6d29.svg" alt="TMDB" />
        </p>
        <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
      </div>
    </div>
  )
}

export default App
