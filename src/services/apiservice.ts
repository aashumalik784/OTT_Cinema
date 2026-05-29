// Search Movies - Hindi Priority
export const searchMovies = async (query: string, page: number = 1) => {
  return fetchFromTMDB(`/search/movie?query=${encodeURIComponent(query)}&page=${page}&region=IN`);
}

// Update getMovies function - page add kar
export const getMovies = async (endpoint: string, page: number = 1) => {
  return fetchFromTMDB(`${endpoint}?page=${page}`);
}

// Update sabhi category functions mein page add kar:
export const getBollywoodMovies = async (page: number = 1) => {
  return fetchFromTMDB(`/discover/movie?with_original_language=hi&region=IN&sort_by=popularity.desc&page=${page}`);
}

export const getSouthHindiMovies = async (page: number = 1) => {
  return fetchFromTMDB(`/discover/movie?with_original_language=te,ta,ml,kn&sort_by=popularity.desc&page=${page}`);
}

export const getHollywoodHindi = async (page: number = 1) => {
  return fetchFromTMDB(`/discover/movie?with_original_language=en&watch_region=IN&sort_by=popularity.desc&page=${page}`);
}

export const getNetflixMovies = async (page: number = 1) => {
  return fetchFromTMDB(`/discover/movie?with_watch_providers=8&watch_region=IN&sort_by=popularity.desc&page=${page}`);
}

export const getPrimeMovies = async (page: number = 1) => {
  return fetchFromTMDB(`/discover/movie?with_watch_providers=119&watch_region=IN&sort_by=popularity.desc&page=${page}`);
}

export const getHotstarMovies = async (page: number = 1) => {
  return fetchFromTMDB(`/discover/movie?with_watch_providers=122&watch_region=IN&sort_by=popularity.desc&page=${page}`);
}

export const getKDrama = async (page: number = 1) => {
  return fetchFromTMDB(`/discover/tv?with_origin_country=KR&sort_by=popularity.desc&page=${page}`);
}

export const getHindiWebSeries = async (page: number = 1) => {
  return fetchFromTMDB(`/discover/tv?with_original_language=hi&sort_by=popularity.desc&page=${page}`);
}
