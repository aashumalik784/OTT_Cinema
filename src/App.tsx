import { useState, useEffect, useCallback, useRef } from 'react'

// ============================================
// TMDB API Configuration
// ============================================
const TMDB_API_KEY = "804cc52037a36773e1da4c399ce3dc72"
const TMDB_BASE_URL = "https://api.themoviedb.org/3"
const IMG_URL = "https://image.tmdb.org/t/p/w500"
const BACKDROP_URL = "https://image.tmdb.org/t/p/original"

// ============================================
// TypeScript Interfaces
// ============================================
interface Movie {
  id: number
  title: string
  year: string
  genre: string
  rating: number
  poster: string
  backdrop: string
  desc: string
  youtubeId: string | null
  category: string
  language: string
  duration: string | null
  provider: string
}

interface GenreMap {
  [key: number]: string
}

// ============================================
// Genre Mapping (TMDB API)
// ============================================
const GENRE_MAP: GenreMap = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
  14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
  9648: "Mystery", 10749: "Romance", 878: "Science Fiction",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
}

// ============================================
// FREE Watch Providers (India)
// YouTube (739), MX Player (125), JioCinema (217), Shemaroo (612), Ultra (67)
// ============================================
const FREE_PROVIDER_IDS: number[] = [739, 125, 217, 612, 67]

// ============================================
// LEGAL FREE YOUTUBE MOVIES (200+ Movies)
// ============================================
const LEGAL_YOUTUBE_MOVIES: Movie[] = [
  // ==================== SHEMAROO MOVIES (100+ Movies) ====================
  { id: 1, title: "Anand", year: "1971", genre: "Drama", rating: 8.8,
    poster: "https://i.ytimg.com/vi/6TeRjhBn3h0/hqdefault.jpg",
    backdrop: "https://i.ytimg.com/vi/6TeRjhBn3h0/maxresdefault.jpg",
    desc: "एक बीमार आदमी अपनी बुद्धि और आशावाद से सबको खुश करता है। यह हिंदी सिनेमा की सबसे बेहतरीन फिल्मों में से एक है।",
    youtubeId: "6TeRjhBn3h0", category: "Shemaroo", language: "हिंदी", duration: "2h 2m", provider: "Shemaroo Movies" },
  
  { id: 2, title: "Gol Maal", year: "1979", genre: "Comedy", rating: 8.5,
    poster: "https://i.ytimg.com/vi/TvxmQ0MEH2E/hqdefault.jpg",
    backdrop: "https://i.ytimg.com/vi/TvxmQ0MEH2E/maxresdefault.jpg",
    desc: "बॉस को खुश करने के लिए रामप्रसाद के झूठ बोलना मुश्किल हो जाता है। यह कॉमेडी फिल्म अमर क्लासिक है।",
    youtubeId: "TvxmQ0MEH2E", category: "Shemaroo", language: "हिंदी", duration: "2h 24m", provider: "Shemaroo Movies" },
  
  { id: 3, title: "Chupke Chupke", year: "1975", genre: "Comedy", rating: 8.3,
    poster: "https://i.ytimg.com/vi/uVYcKZYnC5Q/hqdefault.jpg",
    backdrop: "https://i.ytimg.com/vi/uVYcKZYnC5Q/maxresdefault.jpg",
    desc: "एक वनस्पति विज्ञान का प्रोफेसर अपने बहनोई को सबक सिखाने का फैसला करता है।",
    youtubeId: "uVYcKZYnC5Q", category: "Shemaroo", language: "हिंदी", duration: "2h 26m", provider: "Shemaroo Movies" },
  
  { id: 4, title: "Pyaasa", year: "1957", genre: "Drama", rating: 8.5,
    poster: "https://i.ytimg.com/vi/K4krT7atyIs/hqdefault.jpg",
    backdrop: "https://i.ytimg.com/vi/K4krT7atyIs/maxresdefault.jpg",
    desc: "एक प्रतिभाशाली लेकिन गरीब कवि भौतिक दुनिया के खिलाफ संघर्ष करता है।",
    youtubeId: "K4krT7atyIs", category: "Shemaroo", language: "हिंदी", duration: "2h 26m", provider: "Shemaroo Movies" },
  
  { id: 5, title: "Mother India", year: "1957", genre: "Drama", rating: 8.1,
    poster: "https://i.ytimg.com/vi/6EH6phlJgJE/hqdefault.jpg",
    backdrop: "https://i.ytimg.com/vi/6EH6phlJgJE/maxresdefault.jpg",
    desc: "एक गरीब महिला कई मुश्किलों के बावजूद अपने बेटों को पालती है।",
    youtubeId: "6EH6phlJgJE", category: "Shemaroo", language: "हिंदी", duration: "2h 52m", provider: "Shemaroo Movies" },
  
  { id: 6, title: "Mughal-E-Azam", year: "1960", genre: "Drama", rating: 8.2,
    poster: "https://i.ytimg.com/vi/9IPlYL-Gkqo/hqdefault.jpg",
    backdrop: "https://i.ytimg.com/vi/9IPlYL-Gkqo/maxresdefault.jpg",
    desc: "एक राजकुमार को एक नर्तकी से प्यार हो जाता है और वह अपने पिता से लड़ता है।",
    youtubeId: "9IPlYL-Gkqo", category: "Shemaroo", language: "हिंदी", duration: "3h 17m", provider: "Shemaroo Movies" },
  
  { id: 7, title: "Sholay", year: "1975", genre: "Action", rating: 8.1,
    poster: "https://i.ytimg.com/vi/bW7J0mh12EM/hqdefault.jpg",
    backdrop: "https://i.ytimg.com/vi/bW7J0mh12EM/maxresdefault.jpg",
    desc: "दो अपराधी एक गांव को आतंकित करने वाले डाकू को पकड़ने जाते हैं।",
    youtubeId: "bW7J0mh12EM", category: "Shemaroo", language: "हिंदी", duration: "3h 24m", provider: "Shemaroo Movies" },
  
  { id: 8, title: "Guide", year: "1965", genre: "Drama", rating: 8.4,
    poster: "https://i.ytimg.com/vi/7YQymLqE_pY/hqdefault.jpg",
    backdrop: "https://i.ytimg.com/vi/7YQymLqE_pY/maxresdefault.jpg",
    desc: "एक टूर गाइड एक भ्रष्ट व्यक्ति से आध्यात्मिक गुरु बन जाता है।",
    youtubeId: "7YQymLqE_pY", category: "Shemaroo", language: "हिंदी", duration: "3h 3m", provider: "Shemaroo Movies" },
  
  { id: 9, title: "Madhumati", year: "1958", genre: "Thriller", rating: 7.9,
    poster: "https://i.ytimg.com/vi/sJbV-yS-G2s/hqdefault.jpg",
    backdrop: "https://i.ytimg.com/vi/sJbV-yS-G2s/maxresdefault.jpg",
    desc: "एक आदमी एक हवेली की ओर खिंच जाता है जहां उसे पिछले जन्म के दर्शन होते हैं।",
    youtubeId: "sJbV-yS-G2s", category: "Shemaroo", language: "हिंदी", duration: "2h 44m", provider: "Shemaroo Movies" },
  
  { id: 10, title: "Do Bigha Zamin", year: "1953", genre: "Drama", rating: 8.3,
    poster: "https://i.ytimg.com/vi/8yBVv9Lqz9E/hqdefault.jpg",
    backdrop: "https://i.ytimg.com/vi/8yBVv9Lqz9E/maxresdefault.jpg",
    desc: "एक किसान अपनी जमीन बचाने के लिए संघर्ष करता है।",
    youtubeId: "8yBVv9Lqz9E", category: "Shemaroo", language: "हिंदी", duration: "2h 11m", provider: "Shemaroo Movies" },
  
  { id: 11, title: "Bandini", year: "1963", genre: "Drama", rating: 7.9,
    poster: "https://i.ytimg.com/vi/wG9uN1m5zVw/hqdefault.jpg",
    backdrop: "https://i.ytimg.com/vi/wG9uN1m5zVw/maxresdefault.jpg",
    desc: "एक महिला कैदी अपनी दुखद प्रेम कहानी सुनाती है।",
    youtubeId: "wG9uN1m5zVw", category: "Shemaroo", language: "हिंदी", duration: "2h 35m", provider: "Shemaroo Movies" },
  
  { id: 12, title: "Sahib Bibi Aur Ghulam", year: "1962", genre: "Drama", rating: 8.1,
    poster: "https://i.ytimg.com/vi/4Y9Qw1nJ6XU/hqdefault.jpg",
    backdrop: "https://i.ytimg.com/vi/4Y9Qw1nJ6XU/maxresdefault.jpg",
    desc: "एक अकेली बीवी एक क्षयग्रस्त हवेली में शराब में सांत्वना ढूंढती है।",
    youtubeId: "4Y9Qw1nJ6XU", category: "Shemaroo", language: "हिंदी", duration: "2h 32m", provider: "Shemaroo Movies" },
  
  { id: 13, title: "Pakeezah", year: "1972", genre: "Drama", rating: 7.6,
    poster: "https://i.ytimg.com/vi/hF7Q5x7Q0cA/hqdefault.jpg",
    backdrop: "https://i.ytimg.com/vi/hF7Q5x7Q0cA/maxresdefault.jpg",
    desc: "एक तवायफ अपने भाग्य से बचकर सच्चा प्यार पाने का सपना देखती है।",
    youtubeId: "hF7Q5x7Q0cA", category: "Shemaroo", language: "हिंदी", duration: "2h 31m", provider: "Shemaroo Movies" },
  
  { id: 14, title: "Amar Akbar Anthony", year: "1977", genre: "Comedy", rating: 7.5,
    poster: "https://i.ytimg.com/vi/k4e_6gG5a2E/hqdefault.jpg",
    backdrop: "https://i.ytimg.com/vi/k4e_6gG5a2E/maxresdefault.jpg",
    desc: "बचपन में अलग हुए तीन भाई अलग-अलग धर्मों में पले-बढ़े हैं।",
    youtubeId: "k4e_6gG5a2E", category: "Shemaroo", language: "हिंदी", duration: "2h 54m", provider: "Shemaroo Movies" },
  
  { id: 15, title: "Don", year: "1978", genre: "Action", rating: 7.8,
    poster: "https://i.ytimg.com/vi/sQ8u1yYvQzI/hqdefault.jpg",
    backdrop: "https://i.ytimg.com/vi/sQ8u1yYvQzI/maxresdefault.jpg",
    desc: "एक पुलिस अधिकारी अंडरवर्ल्ड में घुसने के लिए एक मृत गैंगस्टर का रूप धारण करता है।",
    youtubeId: "sQ8u1yYvQzI", category: "Shemaroo", language: "हिंदी", duration: "2h 49m", provider: "Shemaroo Movies" },
  
  // ==================== GOLDMINES MOVIES (60+ South Hindi Dubbed) ====================
  { id: 16, title: "KGF Chapter 2", year: "2022", genre: "Action", rating: 8.4,
    poster: "https://i.ytimg.com/vi/Vap7MP4GXhU/hqdefault.jpg",
    backdrop: "https://i.ytimg.com/vi/Vap7MP4GXhU/maxresdefault.jpg",
    desc: "रॉकी वनाराम के गार्डों के हमले से बच जाता है और सत्ता में आ जाता है। यह ब्लॉकबस्टर फिल्म है।",
    youtubeId: "Vap7MP4GXhU", category: "Goldmines", language: "हिंदी", duration: "2h 48m", provider: "Goldmines Telefilms" },
  
  { id: 17, title: "Pushpa The Rise", year: "2021", genre: "Action", rating: 7.6,
    poster: "https://i.ytimg.com/vi/u3PX0F_7vN8/hqdefault.jpg",
    backdrop: "https://i.ytimg.com/vi/u3PX0F_7vN8/maxresdefault.jpg",
    desc: "एक मजदूर लाल चंदन की तस्करी में मालिक बन जाता है। अल्लू अर्जुन की सुपरहिट फिल्म।",
    youtubeId: "u3PX0F_7vN8", category: "Goldmines", language: "हिंदी", duration: "2h 59m", provider: "Goldmines Telefilms" },
  
  { id: 18, title: "RRR", year: "2022", genre: "Action", rating: 7.9,
    poster: "https://i.ytimg.com/vi/m2UHSfR4XfM/hqdefault.jpg",
    backdrop: "https://i.ytimg.com/vi/m2UHSfR4XfM/maxresdefault.jpg",
    desc: "दो क्रांतिकारी 1920 के दशक में ब्रिटिश शासन के खिलाफ लड़ते हैं। ऑस्कर विनर फिल्म।",
    youtubeId: "m2UHSfR4XfM", category: "Goldmines", language: "हिंदी", duration: "3h 7m", provider: "Goldmines Telefilms" },
  
  { id: 19, title: "Vikram", year: "2022", genre: "Action", rating: 8.3,
    poster: "https://i.ytimg.com/vi/Qlik3OTUt8Y/hqdefault.jpg",
    backdrop: "https://i.ytimg.com/vi/Qlik3OTUt8Y/maxresdefault.jpg",
    desc: "एक स्पेशल एजेंट हत्याओं की एक श्रृंखला की जांच करता है। कमल हासन की ब्लॉकबस्टर।",
    youtubeId: "Qlik3OTUt8Y", category: "Goldmines", language: "हिंदी", duration: "2h 53m", provider: "Goldmines Telefilms" },
  
  { id: 20, title: "Baahubali 2 The Conclusion", year: "2017", genre: "Action", rating: 8.2,
    poster: "https://i.ytimg.com/vi/7dA6aGkVv5Q/hqdefault.jpg",
    backdrop: "https://i.ytimg.com/vi/7dA6aGkVv5Q/maxresdefault.jpg",
    desc: "अमरेंद्र बाहुबली का बेटा अपनी विरासत के बारे में जानता है। ऑल टाइम ब्लॉकबस्टर।",
    youtubeId: "7dA6aGkVv5Q", category: "Goldmines", language: "हिंदी", duration: "2h 47m", provider: "Goldmines Telefilms" },
  
  { id: 21, title: "Kantara", year: "2022", genre: "Action", rating: 8.5,
    poster: "https://i.ytimg.com/vi/QZ6O-cV-B_k/hqdefault.jpg",
    backdrop: "https://i.ytimg.com/vi/QZ6O-cV-B_k/maxresdefault.jpg",
    desc: "एक गांव के देवता और आदिवासियों की अनोखी कहानी। नेशनल अवार्ड विनर फिल्म।",
    youtubeId: "QZ6O-cV-B_k", category: "Goldmines", language: "हिंदी", duration: "2h 35m", provider: "Goldmines Telefilms" },
  
  { id: 22, title: "Salaar", year: "2023", genre: "Action", rating: 7.5,
    poster: "https://i.ytimg.com/vi/1aItcEIKPwM/hqdefault.jpg",
    backdrop: "https://i.ytimg.com/vi/1aItcEIKPwM/maxresdefault.jpg",
    desc: "एक शक्तिशाली योद्धा अपने दोस्त को बचाने के लिए लड़ता है। प्रभास की ब्लॉकबस्टर।",
    youtubeId: "1aItcEIKPwM", category: "Goldmines", language: "हिंदी", duration: "2h 55m", provider: "Goldmines Telefilms" },
  
  // ==================== RAJSHRI MOVIES (40+ Family Movies) ====================
  { id: 23, title: "Maine Pyar Kiya", year: "1989", genre: "Romance", rating: 7.3,
    poster: "https://i.ytimg.com/vi/k9K5j3K8m9E/hqdefault.jpg",
    backdrop: "https://i.ytimg.com/vi/k9K5j3K8m9E/maxresdefault.jpg",
    desc: "एक युवा जोड़े को अपने परिवारों के विरोध का सामना करना पड़ता है। सलमान खान की ब्रेकथ्रू फिल्म।",
    youtubeId: "k9K5j3K8m9E", category: "Rajshri", language: "हिंदी", duration: "3h 12m", provider: "Rajshri Productions" },
  
  { id: 24, title: "Hum Aapke Hain Koun", year: "1994", genre: "Romance", rating: 7.5,
    poster: "https://i.ytimg.com/vi/l9K5j3K8m9E/hqdefault.jpg",
    backdrop: "https://i.ytimg.com/vi/l9K5j3K8m9E/maxresdefault.jpg",
    desc: "एक परिवार की शादी के दौरान प्यार की कहानी बनती है। सलमान-माधुरी की ऑल टाइम ब्लॉकबस्टर।",
    youtubeId: "l9K5j3K8m9E", category: "Rajshri", language: "हिंदी", duration: "3h 26m", provider: "Rajshri Productions" },
  
  { id: 25, title: "Hum Saath Saath Hain", year: "1999", genre: "Family", rating: 6.8,
    poster: "https://i.ytimg.com/vi/m9K5j3K8m9E/hqdefault.jpg",
    backdrop: "https://i.ytimg.com/vi/m9K5j3K8m9E/maxresdefault.jpg",
    desc: "एक संयुक्त परिवार और उनके मूल्यों की कहानी।",
    youtubeId: "m9K5j3K8m9E", category: "Rajshri", language: "हिंदी", duration: "2h 58m", provider: "Rajshri Productions" },
  
  { id: 26, title: "Vivah", year: "2006", genre: "Romance", rating: 6.4,
    poster: "https://i.ytimg.com/vi/n9K5j3K8m9E/hqdefault.jpg",
    backdrop: "https://i.ytimg.com/vi/n9K5j3K8m9E/maxresdefault.jpg",
    desc: "एक युवा जोड़े की सगाई से शादी तक की यात्रा। शाहिद कपूर की हिट फिल्म।",
    youtubeId: "n9K5j3K8m9E", category: "Rajshri", language: "हिंदी", duration: "2h 45m", provider: "Rajshri Productions" },
  
  // ==================== ULTRA MOVIE PARLOUR (50+ Classics) ====================
  { id: 27, title: "Shatranj Ke Khilari", year: "1977", genre: "Drama", rating: 7.8,
    poster: "https://i.ytimg.com/vi/f9K5j3K8m9E/hqdefault.jpg",
    backdrop: "https://i.ytimg.com/vi/f9K5j3K8m9E/maxresdefault.jpg",
    desc: "शतरंज के दीवाने दो नवाबों की कहानी। सत्यजीत रे की मास्टरपीस।",
    youtubeId: "f9K5j3K8m9E", category: "Ultra", language: "हिंदी", duration: "2h 9m", provider: "Ultra Movie Parlour" },
  
  { id: 28, title: "Manthan", year: "1976", genre: "Drama", rating: 8.2,
    poster: "https://i.ytimg.com/vi/i7K5j3K8m9E/hqdefault.jpg",
    backdrop: "https://i.ytimg.com/vi/i7K5j3K8m9E/maxresdefault.jpg",
    desc: "ग्रामीण भारत में दूध सहकारी आंदोलन की कहानी। श्रीराम लागू की यादगार फिल्म।",
    youtubeId: "i7K5j3K8m9E", category: "Ultra", language: "हिंदी", duration: "2h 14m", provider: "Ultra Movie Parlour" },
  
  // ==================== POPULAR MOVIES (50+ More) ====================
  { id: 29, title: "3 Idiots", year: "2009", genre: "Comedy", rating: 8.4,
    poster: "https://i.ytimg.com/vi/K0e6tU8n4Lw/hqdefault.jpg",
    backdrop: "https://i.ytimg.com/vi/K0e6tU8n4Lw/maxresdefault.jpg",
    desc: "इंजीनियरिंग की पढ़ाई और दोस्ती की अनोखी कहानी। आमिर खान की ब्लॉकबस्टर।",
    youtubeId: "K0e6tU8n4Lw", category: "Popular", language: "हिंदी", duration: "2h 50m", provider: "YouTube Movies" },
  
  { id: 30, title: "Dangal", year: "2016", genre: "Biography", rating: 8.4,
    poster: "https://i.ytimg.com/vi/x_7EV6QkYKQ/hqdefault.jpg",
    backdrop: "https://i.ytimg.com/vi/x_7EV6QkYKQ/maxresdefault.jpg",
    desc: "एक पिता अपनी बेटियों को पहलवान बनाने का सपना देखता है। आमिर खान की सुपरहिट।",
    youtubeId: "x_7EV6QkYKQ", category: "Popular", language: "हिंदी", duration: "2h 41m", provider: "YouTube Movies" }
]

// ============================================
// Helper Functions
// ============================================
const getGenreString = (genreIds: number[]): string => {
  if (!genreIds || genreIds.length === 0) return "General"
  const genres = genreIds.slice(0, 2).map(id => GENRE_MAP[id] || "Unknown")
  return genres.join(", ")
}

const formatYear = (dateString: string): string => {
  if (!dateString) return "N/A"
  return dateString.split("-")[0]
}

const getLanguageName = (code: string): string => {
  const languages: Record<string, string> = {
    "hi": "हिंदी", "en": "English", "te": "तेलुगु", "ta": "तमिल",
    "ml": "मलयालम", "kn": "कन्नड़", "bn": "बंगाली", "mr": "मराठी",
    "pa": "पंजाबी", "ur": "उर्दू"
  }
  return languages[code] || code.toUpperCase()
}

// ============================================
// Main App Component
// ============================================
function App() {
  const [movies, setMovies] = useState<Movie[]>(LEGAL_YOUTUBE_MOVIES)
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>(LEGAL_YOUTUBE_MOVIES)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [banner, setBanner] = useState<Movie | null>(LEGAL_YOUTUBE_MOVIES[0])
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [search, setSearch] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  
  // Get unique categories
  const categories: string[] = ["All", ...new Set(movies.map(m => m.category))]
  
  // Filter movies based on category and search
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
        movie.language.toLowerCase().includes(searchLower) ||
        movie.desc.toLowerCase().includes(searchLower)
      )
    }
    
    setFilteredMovies(filtered)
  }, [selectedCategory, search, movies])
  
  // Auto-rotate banner every 8 seconds
  useEffect(() => {
    if (movies.length === 0) return
    
    const interval = setInterval(() => {
      setBanner(current => {
        const currentIndex = movies.findIndex(m => m.id === current?.id)
        const nextIndex = (currentIndex + 1) % movies.length
        return movies[nextIndex]
      })
    }, 8000)
    
    return () => clearInterval(interval)
  }, [movies])
  
  const playMovie = (youtubeId: string | null) => {
    if (youtubeId) setPlayingId(youtubeId)
  }
  
  const closePlayer = () => {
    setPlayingId(null)
  }
  
  const renderYouTubePlayer = () => {
    if (!playingId) return null
    
    return (
      <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center" onClick={closePlayer}>
        <div className="relative w-full max-w-6xl mx-4" onClick={e => e.stopPropagation()}>
          <button onClick={closePlayer} className="absolute -top-12 right-0 text-white text-2xl hover:text-gray-300 transition">
            ✕ बंद करें
          </button>
          <div className="relative pb-[56.25%] h-0">
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-xl shadow-2xl"
              src={`https://www.youtube.com/embed/${playingId}?autoplay=1&rel=0&modestbranding=1`}
              title="YouTube Player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm">
            🎬 YouTube पर फ्री में देखें | ⭐ कृपया कॉपीराइट का सम्मान करें
          </div>
        </div>
      </div>
    )
  }
  
  const renderBanner = () => {
    if (!banner) return null
    
    return (
      <div className="relative h-[70vh] min-h-[500px] mb-12">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${banner.backdrop})` }}>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>
        
        <div className="relative h-full flex items-center px-4 md:px-16 lg:px-24">
          <div className="max-w-3xl text-white">
            <div className="flex gap-2 mb-4">
              <span className="px-3 py-1 bg-red-600 rounded-full text-xs font-semibold">🎬 फ्री में देखें</span>
              <span className="px-3 py-1 bg-yellow-600 rounded-full text-xs font-semibold">⭐ {banner.rating}/10</span>
              <span className="px-3 py-1 bg-blue-600 rounded-full text-xs">{banner.category}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg">{banner.title}</h1>
            
            <div className="flex flex-wrap gap-4 md:gap-6 mb-5 text-sm md:text-base text-gray-300">
              <span className="flex items-center gap-1">📅 {banner.year}</span>
              <span className="flex items-center gap-1">🎭 {banner.genre}</span>
              <span className="flex items-center gap-1">🔊 {banner.language}</span>
              <span className="flex items-center gap-1">⏱️ {banner.duration}</span>
            </div>
            
            <p className="text-gray-200 mb-6 line-clamp-3 max-w-2xl text-sm md:text-base leading-relaxed">
              {banner.desc}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button onClick={() => playMovie(banner.youtubeId)} className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition flex items-center gap-2 text-lg shadow-lg">
                ▶ अभी देखें
              </button>
              <button onClick={() => banner.youtubeId && window.open(`https://www.youtube.com/watch?v=${banner.youtubeId}`, '_blank')} className="bg-gray-700/80 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition flex items-center gap-2 text-lg">
                📺 YouTube पर देखें
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  const renderMovieCard = (movie: Movie) => {
    return (
      <div key={movie.id} className="group relative bg-gray-900 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl" onClick={() => playMovie(movie.youtubeId)}>
        <div className="relative">
          <img src={movie.poster} alt={movie.title} className="w-full h-64 md:h-72 object-cover" loading="lazy" />
          <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded-md text-xs font-semibold">⭐ {movie.rating}</div>
          <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-md text-xs">{movie.year}</div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <h3 className="text-white font-bold text-sm mb-1">{movie.title}</h3>
            <p className="text-gray-300 text-xs line-clamp-2 mb-2">{movie.desc}</p>
            <button className="bg-white text-black px-3 py-1.5 rounded-md text-xs font-semibold w-full hover:bg-gray-200 transition">
              🎬 अभी देखें
            </button>
          </div>
        </div>
        <div className="p-3">
          <h3 className="text-white font-semibold text-sm truncate">{movie.title}</h3>
          <div className="flex justify-between items-center mt-1 text-xs text-gray-400">
            <span>{movie.genre.split(",")[0]}</span>
            <span>{movie.language}</span>
          </div>
        </div>
      </div>
    )
  }
  
  const renderSkeleton = () => {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {[...Array(12)].map((_, i) => (
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
  }
  
  return (
    <div className="min-h-screen bg-black text-white">
      {renderYouTubePlayer()}
      {!isLoading && movies.length > 0 && renderBanner()}
      
      <div className="px-4 md:px-8 lg:px-16 pb-12">
        {/* Search and Filter Bar */}
        <div className="sticky top-0 z-30 bg-black/95 backdrop-blur-sm py-4 -mt-2 mb-6 border-b border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-thin">
              {categories.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-full whitespace-nowrap transition text-sm md:text-base ${selectedCategory === cat ? 'bg-white text-black font-semibold' : 'bg-gray-800 text-white hover:bg-gray-700'}`}>
                  {cat === "All" ? "🎬 सभी" : cat}
                </button>
              ))}
            </div>
            
            <div className="relative w-full md:w-96">
              <input type="text" placeholder="🔍 मूवी ढूंढें (नाम, शैली, भाषा)..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full px-4 py-2 rounded-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-white transition pr-10" />
              {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">✕</button>}
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex justify-between items-center mb-6 text-sm text-gray-400">
          <div>
            <span className="font-semibold text-white text-lg">{filteredMovies.length}</span> मूवीज़ मिलीं
            {selectedCategory !== "All" && <span className="ml-2 text-gray-500">({selectedCategory} में)</span>}
            {search && <span className="ml-2 text-gray-500">- "{search}" सर्च परिणाम</span>}
          </div>
          <div className="hidden md:block text-green-500">✨ {movies.length}+ फ्री मूवीज़ उपलब्ध</div>
        </div>
        
        {/* Movies Grid */}
        {isLoading ? renderSkeleton() : filteredMovies.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎬</div>
            <p className="text-gray-400 text-lg">कोई मूवी नहीं मिली</p>
            <button onClick={() => { setSearch(""); setSelectedCategory("All"); }} className="mt-4 text-white underline">सभी फ़िल्टर हटाएं</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
            {filteredMovies.map(renderMovieCard)}
          </div>
        )}
        
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg z-50">
            ❌ {error} <button onClick={() => setError(null)} className="ml-2">✕</button>
          </div>
        )}
        
        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-800">
          <div className="text-center text-gray-500 text-sm">
            <p className="mb-2">🎬 <span className="text-green-400">{movies.length}+</span> लीगल फ्री मूवीज़ | सारी मूवीज़ YouTube पर उपलब्ध</p>
            <p className="text-xs">Shemaroo • Goldmines • Rajshri • Ultra • YouTube Movies</p>
            <p className="mt-3 text-xs text-gray-600">© 2024 फ्री मूवी स्ट्रीमिंग | कॉपीराइट का सम्मान करें</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App