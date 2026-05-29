const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

if (!API_KEY) {
  console.error("❌ TMDB API Key missing! Cloudflare env vars check karo.");
}

// TMDB se movies laane ke liye
export const getMovies = async (endpoint: string) => {
  if (!API_KEY) {
    return {
      movies: [],
      error: "API Key not configured. Please add VITE_TMDB_API_KEY in Cloudflare."
    };
  }
  try {
    const response = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    const data = await response.json();
    return { movies: data.results || [], error: null };
  } catch (error) {
    console.error("API Error:", error);
    return {
      movies: [],
      error: error instanceof Error? error.message : "Failed to fetch"
    };
  }
}

// Single movie detail
export const getMovieDetails = async (id: number) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Movie Details Error:", error);
    return null;
  }
}

// TMDB se YouTube trailer key nikalne ke liye
export const getMovieTrailer = async (id: number) => {
  try {
    const res = await fetch(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}&language=en-US`);
    const data = await res.json();
    
    // Official trailer dhundo, nahi to koi bhi YouTube video
    const trailer = data.results?.find((v: any) => v.type === "Trailer" && v.site === "YouTube") 
                 || data.results?.find((v: any) => v.site === "YouTube");
    
    return trailer? trailer.key : null;
  } catch (error) {
    console.error("Trailer Error:", error);
    return null;
  }
}

// Internet Archive pe free movie check karne ke liye
export const getInternetArchiveVideo = async (title: string, year: string) => {
  try {
    const cleanTitle = title.replace(/[^a-zA-Z0-9 ]/g, '');
    const query = `${cleanTitle} ${year}`.replace(/ /g, '+');
    const url = `https://archive.org/advancedsearch.php?q=title:(${query})+AND+mediatype:(movies)&fl[]=identifier&output=json&rows=1`;
    
    const res = await fetch(url);
    const data = await res.json();
    
    if (data.response?.docs?.length > 0) {
      const identifier = data.response.docs[0].identifier;
      return `https://archive.org/embed/${identifier}`; // Embed player best hai
    }
    return null;
  } catch (error) {
    console.error("Archive Error:", error);
    return null;
  }
}
