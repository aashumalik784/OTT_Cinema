import { useState } from 'react'

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
  language: string
  duration: string
}

// 👇 यहाँ 100 movies add कर दे - सब Free Legal
const freeMovies: Movie[] = [
  { 
    id: 1, title: "Anand", year: "1971", genre: "Drama", rating: 8.8,
    poster: "https://i.ytimg.com/vi/6TeRjhBn3h0/hqdefault.jpg",
    backdrop: "https://i.ytimg.com/vi/6TeRjhBn3h0/maxresdefault.jpg",
    desc: "A terminally ill man spreads joy to everyone around him.",
    youtubeId: "6TeRjhBn3h0", language: "Hindi", duration: "2h 2m"
  },
  { 
    id: 2, title: "Gol Maal", year: "1979", genre: "Comedy", rating: 8.5,
    poster: "https://i.ytimg.com/vi/TvxmQ0MEH2E/hqdefault.jpg",
    backdrop: "https://i.ytimg.com/vi/TvxmQ0MEH2E/maxresdefault.jpg",
    desc: "Ramprasad pretends to have a twin to save his job.",
    youtubeId: "TvxmQ0MEH2E", language: "Hindi", duration: "2h 24m"
  },
  { 
    id: 3, title: "Chupke Chupke", year: "1975", genre: "Comedy", rating: 8.3,
    poster: "https://i.ytimg.com/vi/uVYcKZYnC5Q/hqdefault.jpg",
    backdrop: "https://i.ytimg.com/vi/uVYcKZYnC5Q/maxresdefault.jpg",
    desc: "A professor pretends to be a driver to test his wife's brother.",
    youtubeId: "uVYcKZYnC5Q", language: "Hindi", duration: "2h 26m"
  },
  { 
    id: 4, title: "Pyaasa", year: "1957", genre: "Drama", rating: 8.4,
    poster: "https://i.ytimg.com/vi/K4krT7atyIs/hqdefault.jpg",
    backdrop: "https://i.ytimg.com/vi/K4krT7atyIs/maxresdefault.jpg",
    desc: "A poet's struggle for recognition in a materialistic world.",
    youtubeId: "K4krT7atyIs", language: "Hindi", duration: "2h 26m"
  },
  { 
    id: 5, title: "Mother India", year: "1957", genre: "Drama", rating: 8.1,
    poster: "https://i.ytimg.com/vi/6EH6phlJgJE/hqdefault.jpg",
    backdrop: "https://i.ytimg.com/vi/6EH6phlJgJE/maxresdefault.jpg",
    desc: "A poverty-stricken woman raises her sons through hardship.",
    youtubeId: "6EH6phlJgJE", language: "Hindi", duration: "2h 52m"
  },
  // यहाँ 95 movies और add कर दे YouTube से
]

function App() {
  const [movies] = useState<Movie[]>(freeMovies)
  const [playingMovie, setPlayingMovie] = useState<string | null>(null)
  const [banner] = useState<Movie | null>(freeMovies[0])
  const [selectedGenre, setSelectedGenre] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [myList, setMyList] = useState<number[]>([])

  const filteredMovies = movies.filter(movie => {
    const matchGenre = selectedGenre === "All" || movie.genre.includes(selectedGenre)
    const matchSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchGenre && matchSearch
  })

  const playMovie = (youtubeId: string) => setPlayingMovie(youtubeId)
  const toggleMyList = (movieId: number) => {
    if (myList.includes(movieId)) setMyList(myList.filter(id => id !== movieId))
    else setMyList([...myList, movieId])
  }

  const genres = ["All", "Drama", "Comedy", "Romance", "Action", "Mystery"]

  return (
    <div className="app">
      {playingMovie && (
        <div className="video-modal" onClick={() => setPlayingMovie(null)}>
          <div className="video-container" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setPlayingMovie(null)}>✕</button>
            <iframe
              width="100%" height="100%"
              src={`https://www.youtube.com/embed/${playingMovie}?autoplay=1&rel=0`}
              frameBorder="0" allow="autoplay; encrypted-media; fullscreen" allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      <nav className="navbar">
        <h1 className="logo"><span className="logo-c">C</span>INEMA</h1>
        <div className="nav-icons"><span className="icon">🔍</span><span className="icon">👤</span></div>
      </nav>

      {banner && (
        <header className="banner" style={{ backgroundImage: `url(${banner.backdrop})` }}>
          <div className="banner-content">
            <div className="tags"><span className="tag-trending">🔥 100% FREE</span><span className="tag-rating">★ {banner.rating}</span></div>
            <h1 className="banner-title">{banner.title}</h1>
            <p className="banner-info">{banner.year} • {banner.duration} • {banner.language}</p>
            <p className="banner-genre">{banner.genre}</p>
            <p className="banner-desc">{banner.desc}</p>
            <div className="banner-buttons">
              <button className="play-btn" onClick={() => playMovie(banner.youtubeId)}>▶ Play Free Now</button>
              <button className="list-btn" onClick={() => toggleMyList(banner.id)}>
                {myList.includes(banner.id) ? '✓ My List' : '+ My List'}
              </button>
            </div>
          </div>
        </header>
      )}

      <div className="search-bar">
        <input type="text" placeholder="Search movies..." value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} className="search-input" />
      </div>

      <div className="categories">
        {genres.map(genre => (
          <button key={genre} className={`cat-btn ${selectedGenre === genre ? 'active' : ''}`} 
            onClick={() => setSelectedGenre(genre)}>{genre}</button>
        ))}
      </div>

      <div className="row">
        <h2>🎬 Free Bollywood Classics ({filteredMovies.length} Movies)</h2>
        <div className="row-posters">
          {filteredMovies.map((movie: Movie) => (
            <div key={movie.id} className="movie-card">
              <div className="poster-wrapper" onClick={() => playMovie(movie.youtubeId)}>
                <img src={movie.poster} alt={movie.title} className="poster" loading="lazy" />
                <div className="rating-badge">FREE HD</div>
                <div className="play-overlay">▶</div>
              </div>
              <h3>{movie.title}</h3>
              <p>{movie.year} • {movie.genre}</p>
              <button className="add-list-btn" onClick={(e) => {e.stopPropagation(); toggleMyList(movie.id)}}>
                {myList.includes(movie.id) ? '✓ Added' : '+ List'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="row legal-row">
        <h2>⚖️ 100% Legal - AdSense Ready</h2>
        <div className="legal-box">
          <p>✅ All videos embedded from YouTube Official Channels</p>
          <p>✅ We don't host any video - 100% Legal</p>
          <p>✅ No API needed - Site loads fast</p>
          <p>✅ AdSense Approved Structure</p>
        </div>
      </div>
    </div>
  )
}

export default App
