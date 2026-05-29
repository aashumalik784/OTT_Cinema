const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";

// Vite mein import.meta.env use hota hai
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// API Key check karo
if (!API_KEY) {
  console.error("❌ TMDB API Key missing! Cloudflare env vars check karo.");
}

// Types
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_url: string | null;
  backdrop_url: string | null;
  year: string;
  rating: string;
  vote_average: number;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

export interface MoviesResponse {
  movies: Movie[];
  totalPages: number;
  currentPage: number;
  error?: string;
}

export const getMovies = async (page: number = 1): Promise<MoviesResponse> => {
  // API key nahi hai toh fake data return kar de
  if (!API_KEY) {
    return {
      movies: [],
      totalPages: 0,
      currentPage: 1,
      error: "API Key not configured. Please add VITE_TMDB_API_KEY in Cloudflare."
    };
  }

  try {
    const url = `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=hi-IN&page=${page}`;
    
    const res = await fetch(url);
    
    // HTTP error check
    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status} - ${res.statusText}`);
    }
    
    const data = await res.json();
    
    // TMDB error check
    if (data.success === false) {
      throw new Error(`TMDB Error: ${data.status_message}`);
    }
    
    const movies: Movie[] = data.results.map((m: any) => ({
     ...m,
      poster_url: m.poster_path? `${IMG_BASE_URL}${m.poster_path}` : null,
      backdrop_url: m.backdrop_path? `${BACKDROP_BASE_URL}${m.backdrop_path}` : null,
      year: m.release_date?.split('-')[0] || 'N/A',
      rating: m.vote_average? m.vote_average.toFixed(1) : 'N/A'
    }));
    
    return {
      movies,
      totalPages: data.total_pages || 0,
      currentPage: data.page || 1
    };
    
  } catch (err: any) {
    console.error("🚨 API Error:", err.message);
    return { 
      movies: [], 
      totalPages: 0, 
      currentPage: 1,
      error: err.message 
    };
  }
};

// Search movies function bhi add kar de
export const searchMovies = async (query: string, page: number = 1): Promise<MoviesResponse> => {
  if (!API_KEY) {
    return { movies: [], totalPages: 0, currentPage: 1, error: "API Key missing" };
  }
  
  if (!query.trim()) {
    return { movies: [], totalPages: 0, currentPage: 1 };
  }

  try {
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=hi-IN&query=${encodeURIComponent(query)}&page=${page}`;
    const res = await fetch(url);
    
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    
    const data = await res.json();
    
    const movies: Movie[] = data.results.map((m: any) => ({
     ...m,
      poster_url: m.poster_path? `${IMG_BASE_URL}${m.poster_path}` : null,
      backdrop_url: m.backdrop_path? `${BACKDROP_BASE_URL}${m.backdrop_path}` : null,
      year: m.release_date?.split('-')[0] || 'N/A',
      rating: m.vote_average? m.vote_average.toFixed(1) : 'N/A'
    }));
    
    return {
      movies,
      totalPages: data.total_pages || 0,
      currentPage: data.page || 1
    };
    
  } catch (err: any) {
    console.error("🚨 Search Error:", err.message);
    return { movies: [], totalPages: 0, currentPage: 1, error: err.message };
  }
};
