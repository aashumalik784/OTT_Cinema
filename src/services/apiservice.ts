const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

if (!API_KEY) {
  console.error("❌ TMDB API Key missing! Cloudflare env vars check karo.");
}

// Generic fetch function
const fetchFromTMDB = async (endpoint: string) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}${endpoint.includes('?')? '&' : '?'}api_key=${API_KEY}&language=en-US`);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    const data = await response.json();
    return { movies: data.results || [], error: null };
  } catch (error) {
    console.error("API Error:", error);
    return { movies: [], error: error instanceof Error? error.message : "Failed to fetch" };
  }
}

// 1. Trending
export const getMovies = async (endpoint: string) => {
  return fetchFromTMDB(endpoint);
}

// 2. Bollywood Hindi Movies
export const getBollywoodMovies = async () => {
  return fetchFromTMDB('/discover/movie?with_original_language=hi&region=IN&sort_by=popularity.desc');
}

// 3. South Indian Hindi Dubbed
export const getSouthHindiMovies = async () => {
  return fetchFromTMDB('/discover/movie?with_original_language=te,ta,ml,kn&sort_by=popularity.desc');
}

// 4. Hollywood Hindi Dubbed
export const getHollywoodHindi = async () => {
  return fetchFromTMDB('/discover/movie?with_original_language=en&watch_region=IN&sort_by=popularity.desc');
}

// 5. Netflix Movies
export const getNetflixMovies = async () => {
  return fetchFromTMDB('/discover/movie?with_watch_providers=8&watch_region=IN&sort_by=popularity.desc');
}

// 6. Amazon Prime Movies
export const getPrimeMovies = async () => {
  return fetchFromTMDB('/discover/movie?with_watch_providers=119&watch_region=IN&sort_by=popularity.desc');
}

// 7. JioHotstar Movies
export const getHotstarMovies = async () => {
  return fetchFromTMDB('/discover/movie?with_watch_providers=122&watch_region=IN&sort_by=popularity.desc');
}

// 8. K-Drama
export const getKDrama = async () => {
  return fetchFromTMDB('/discover/tv?with_origin_country=KR&sort_by=popularity.desc');
}

// 9. Hindi Web Series
export const getHindiWebSeries = async () => {
  return fetchFromTMDB('/discover/tv?with_original_language=hi&sort_by=popularity.desc');
}

// Movie/TV Details
export const getMovieDetails = async (id: number, type: string = 'movie') => {
  try {
    const response = await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=en-US`);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Details Error:", error);
    return null;
  }
}

// YouTube Trailer
export const getMovieTrailer = async (id: number, type: string = 'movie') => {
  try {
    const res = await fetch(`${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}&language=en-US`);
    const data = await res.json();
    const trailer = data.results?.find((v: any) => v.type === "Trailer" && v.site === "YouTube") 
                 || data.results?.find((v: any) => v.site === "YouTube");
    return trailer? trailer.key : null;
  } catch (error) {
    console.error("Trailer Error:", error);
    return null;
  }
}

// Internet Archive - Free Movies
export const getInternetArchiveVideo = async (title: string, year: string) => {
  try {
    const cleanTitle = title.replace(/[^a-zA-Z0-9 ]/g, '');
    const query = `${cleanTitle} ${year}`.replace(/ /g, '+');
    const url = `https://archive.org/advancedsearch.php?q=title:(${query})+AND+mediatype:(movies)&fl[]=identifier&output=json&rows=1`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.response?.docs?.length > 0) {
      const identifier = data.response.docs[0].identifier;
      return `https://archive.org/embed/${identifier}`;
    }
    return null;
  } catch (error) {
    console.error("Archive Error:", error);
    return null;
  }
}
