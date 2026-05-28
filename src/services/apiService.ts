
import { API_KEY } from '../constants/apiConfig';

const BASE_URL = "https://api.themoviedb.org/3";

export const getTrendingMovies = async () => {
  try {
    // यहाँ आपकी API Key का उपयोग किया गया है
    const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=hi-IN`);
    const data = await response.json();
    return data.results; 
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
};
