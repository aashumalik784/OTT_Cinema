import { useState } from 'react'
import './App.css'

const dummyMovies = [
  { id: 1, title: "Pathaan", year: "2023", genre: "Action", rating: 8.1, poster: "https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg", backdrop: "https://image.tmdb.org/t/p/original/bQXAqRx2Fgc46uCVWgoPz5L5Dtr.jpg", desc: "An Indian spy takes on the leader of a mercenary army bent on unleashing chaos." },
  { id: 2, title: "Jawan", year: "2023", genre: "Action", rating: 7.9, poster: "https://image.tmdb.org/t/p/w500/jFt1gS4BGHlK8xt76Y81AlpYMRj.jpg", backdrop: "https://image.tmdb.org/t/p/original/iIvQnZyzgx9TkW0YHkaX5r6CmXL.jpg", desc: "A man is driven by a personal vendetta to rectify the wrongs in society." },
  { id: 3, title: "Animal", year: "2023", genre: "Action", rating: 6.2, poster: "https://image.tmdb.org/t/p/w500/5QJ0TQylu4eLoz7xIxU1hUH6imJ.jpg", backdrop: "https://image.tmdb.org/t/p/original/5YZbUmjbMa3ClvSW1Wj3D6XGol.jpg", desc: "The son of a wealthy man returns home and turns to violence." },
  { id: 4, title: "Oppenheimer", year: "2023", genre: "Biography", rating: 8.9, poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", backdrop: "https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg", desc: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb." },
  { id: 5, title: "Avengers: Endgame", year: "2019", genre: "Action", rating: 8.4, poster: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg", backdrop: "https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg", desc: "After the devastating events of Infinity War, the universe is in ruins." },
  { id: 6, title: "Top Gun: Maverick", year: "2022", genre: "Action", rating: 8.3, poster: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg", backdrop: "https://image.tmdb.org/t/p/original/odJ4hx6g6vBt4lBWKFD1tI8WS4x.jpg", desc: "After thirty years, Maverick is still pushing the envelope as a top naval aviator." },
]

function App() {
  const [banner] = useState(dummyMovies[0])
  const [category, setCategory] = useState('all')

  return (
    <div className="app">
      <nav className="navbar">
        <h1 className="logo"><span className="logo-c">C</span>INEMA</h1>
        <div className="nav-icons">
          <span className="icon">🔍</span>
          <span className="icon">👤</span>
        </div>
      </nav>

      <header className="banner" style={{
        backgroundImage: `url(${banner.backdrop})`
      }}>
        <div className="banner-content">
          <div className="tags">
            <span className="tag-trending">🔥 TRENDING</span>
            <span className="tag-rating">★ {banner.rating}</span>
          </div>
          <h1 className="banner-title">{banner.title}</h1>
          <p className="banner-info">{banner.year} • 2h 26m • Hindi</p>
          <p className="banner-genre">{banner.genre} • Thriller</p>
          <p className="banner-desc">{banner.desc}</p>
          <div className="banner-buttons">
            <button className="play-btn">▶ Play Now</button>
            <button className="list-btn">+ My List</button>
            <button className="info-btn">ⓘ Details</button>
          </div>
        </div>
      </header>

      <div className="categories">
        <button className={`cat-btn ${category === 'all'? 'active' : ''}`} onClick={() => setCategory('all')}>✨ All</button>
        <button className="cat-btn">Hindi Movies</button>
        <button className="cat-btn">Hollywood Dubbed</button>
        <button className="cat-btn">South Indian Dubbed</button>
      </div>

      <div className="row">
        <h2>🔥 Trending Now</h2>
        <div className="row-posters">
          {dummyMovies.map(movie => (
            <div key={movie.id} className="movie-card">
              <img src={movie.poster} alt={movie.title} className="poster" />
              <div className="rating-badge">★ {movie.rating}</div>
              <h3>{movie.title}</h3>
              <p>{movie.year} • {movie.genre}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="row">
        <h2>Hollywood Dubbed</h2>
        <div className="row-posters">
          {dummyMovies.slice(3).map(movie => (
            <div key={movie.id} className="movie-card">
              <img src={movie.poster} alt={movie.title} className="poster" />
              <div className="rating-badge">★ {movie.rating}</div>
              <h3>{movie.title}</h3>
              <p>{movie.year} • {movie.genre}</p>
            </div>
          ))}
        </div>
      </div>

      <nav className="bottom-nav">
        <div className="nav-item active">
          <span>🏠</span><p>Home</p>
        </div>
        <div className="nav-item">
          <span>🔍</span><p>Search</p>
        </div>
        <div className="nav-item">
          <span>🔖</span><p>My List</p>
        </div>
        <div className="nav-item">
          <span>👤</span><p>Profile</p>
        </div>
      </nav>
    </div>
  )
}

export default App
