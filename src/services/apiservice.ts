const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

export const getMovies = async (page = 1) => {
  try {
    const res = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=hi-IN&page=${page}`);
    const data = await res.json();
    
    const movies = data.results.map(m => ({
     ...m,
      poster_url: m.poster_path? `${IMG_BASE_URL}${m.poster_path}` : null,
      backdrop_url: m.backdrop_path? `${BACKDROP_BASE_URL}${m.backdrop_path}` : null,
      year: m.release_date?.split('-')[0] || 'N/A',
      rating: m.vote_average?.toFixed(1) || 'N/A'
    }));
    
    return {
      movies,
      totalPages: data.total_pages,
      currentPage: data.page
    };
  } catch (err) {
    console.error("API Error:", err);
    return { movies: [], totalPages: 0, currentPage: 1 };
  }
};
