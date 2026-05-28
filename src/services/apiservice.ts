import { API_KEY } from '../constants/apiConfig';

const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";

export const getTrendingMovies = async (page: number = 1) => {
  try {
    const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=hi-IN&page=${page}`);
    const data = await response.json();
    
    // Image URLs complete karke bhejo
    const moviesWithPoster = data.results.map((movie: any) => ({
      ...movie,
      poster_url: movie.poster_path ? `${IMG_BASE_URL}${movie.poster_path}` : null,
      backdrop_url: movie.backdrop_path ? `${BACKDROP_BASE_URL}${movie.backdrop_path}` : null,
      year: movie.release_date?.split('-')[0] || 'N/A',
      rating: movie.vote_average?.toFixed(1) || 'N/A'
    }));
    
    return {
      movies: moviesWithPoster,
      totalPages: data.total_pages,
      currentPage: data.page
    };
  } catch (error) {
    console.error("Error fetching movies:", error);
    return { movies: [], totalPages: 0, currentPage: 1 };
  }
};

// Multiple categories ke liye
export const getMoviesByCategory = async (category: string, page: number = 1) => {
  try {
    let url = '';
    if (category === 'popular') url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=hi-IN&page=${page}`;
    else if (category === 'top_rated') url = `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=hi-IN&page=${page}`;
    else if (category === 'upcoming') url = `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=hi-IN&page=${page}`;
    else url = `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=hi-IN&page=${page}`;

    const response = await fetch(url);
    const data = await response.json();
    
    const moviesWithPoster = data.results.map((movie: any) => ({
      ...movie,
      poster_url: movie.poster_path ? `${IMG_BASE_URL}${movie.poster_path}` : null,
      backdrop_url: movie.backdrop_path ? `${BACKDROP_BASE_URL}${movie.backdrop_path}` : null,
      year: movie.release_date?.split('-')[0] || 'N/A',
      rating: movie.vote_average?.toFixed(1) || 'N/A'
    }));
    
    return {
      movies: moviesWithPoster,
      totalPages: data.total_pages,
      currentPage: data.page
    };
  } catch (error) {
    console.error("Error fetching movies:", error);
    return { movies: [], totalPages: 0, currentPage: 1 };
  }
};
