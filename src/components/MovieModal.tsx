import { useState } from 'react';
import { getMovieTrailer, getInternetArchiveVideo } from '../services/apiservice';

interface Movie {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  media_type?: string;
}

interface Props {
  movie: Movie;
  onClose: () => void;
}

const MovieModal = ({ movie, onClose }: Props) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const movieTitle = movie.title || movie.name || '';
  const movieDate = movie.release_date || movie.first_air_date || '';
  const movieType = movie.media_type || 'movie';

  const handlePlayNow = async () => {
    setLoading(true);
    
    // Step 1: Pehle Internet Archive pe free movie check kar
    const year = movieDate?.split('-')[0] || '';
    const archiveUrl = await getInternetArchiveVideo(movieTitle, year);
    
    if (archiveUrl) {
      setVideoUrl(archiveUrl);
      setLoading(false);
      return;
    }

    // Step 2: Nahi mili to YouTube trailer chala - movie/tv type ke hisaab se
    const youtubeKey = await getMovieTrailer(movie.id, movieType);
    
    if (youtubeKey) {
      setVideoUrl(`https://www.youtube.com/embed/${youtubeKey}?autoplay=1`);
    } else {
      alert("Sorry, video available nahi hai");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-zinc-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        
        {/* Video Player */}
        {videoUrl? (
          <div className="relative w-full aspect-video bg-black">
            <button 
              onClick={() => setVideoUrl('')} 
              className="absolute -top-10 right-0 text-white text-3xl z-10 hover:text-red-500"
            >✕</button>
            <iframe
              src={videoUrl}
              className="w-full h-full"
              allow="autoplay; fullscreen"
              allowFullScreen
              title={movieTitle}
            ></iframe>
          </div>
        ) : (
          <div 
            className="w-full h-96 bg-cover bg-center relative"
            style={{ 
              backgroundImage: movie.backdrop_path 
               ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` 
                : 'linear-gradient(to bottom, #18181b, #000)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent"></div>
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 text-white text-3xl z-10 hover:text-red-500 bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
            >✕</button>
          </div>
        )}

        {/* Movie Info */}
        <div className="p-6">
          <h2 className="text-3xl font-bold text-white mb-2">{movieTitle}</h2>
          <div className="flex gap-4 text-sm text-gray-400 mb-4">
            <span>⭐ {movie.vote_average?.toFixed(1)}</span>
            <span>{movieDate?.split('-')[0]}</span>
            <span className="capitalize">{movieType}</span>
          </div>
          
          <button 
            onClick={handlePlayNow} 
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-8 py-3 rounded font-bold mb-4 flex items-center gap-2"
          >
            {loading? "Loading..." : "▶ Play Now"}
          </button>

          <p className="text-gray-300 leading-relaxed">{movie.overview || 'No description available.'}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
