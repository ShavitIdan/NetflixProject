import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import tmdbService from '../services/tmdbService';
import { FaPlay, FaStar, FaClock, FaCalendarAlt, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const data = await tmdbService.getMovieDetails(id);
        setMovie(data);
        setError(null);
      } catch (err) {
        setError('Failed to load movie details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-red-600 text-xl">{error || 'Movie not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Backdrop Image with Overlay */}
      <div className="relative h-[70vh]">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10" />
        <img
          src={movie.backdrop_path}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        
        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-black bg-opacity-50 p-2 rounded-full z-20"
        >
          <FaArrowLeft className="text-white text-2xl" />
        </motion.button>

        {/* Movie Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
          <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              <FaStar className="text-yellow-400" />
              <span>{movie.vote_average.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaCalendarAlt />
              <span>{movie.release_date}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaClock />
              <span>{movie.runtime} minutes</span>
            </div>
          </div>
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-md font-semibold"
              onClick={() => navigate(`/watch/${movie.id}`)}
            >
              <FaPlay /> Play
            </motion.button>
          </div>
        </div>
      </div>

      {/* Movie Details */}
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <p className="text-gray-300 mb-8">{movie.overview}</p>

          <h2 className="text-2xl font-bold mb-4">Genres</h2>
          <div className="flex gap-2 mb-8">
            {movie.genres.map(genre => (
              <span key={genre.id} className="bg-gray-800 px-4 py-2 rounded-full">
                {genre.name}
              </span>
            ))}
          </div>

          {/* Cast Section */}
          {movie.credits && movie.credits.cast.length > 0 && (
            <>
              <h2 className="text-2xl font-bold mb-4">Cast</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                {movie.credits.cast.slice(0, 10).map(actor => (
                  <div key={actor.id} className="text-center">
                    <img
                      src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : '/placeholder-actor.jpg'}
                      alt={actor.name}
                      className="w-full h-48 object-cover rounded-lg mb-2"
                    />
                    <p className="font-semibold">{actor.name}</p>
                    <p className="text-gray-400 text-sm">{actor.character}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Similar Movies */}
          {movie.similar && movie.similar.length > 0 && (
            <>
              <h2 className="text-2xl font-bold mb-4">Similar Movies</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {movie.similar.map(similarMovie => (
                  <motion.div
                    key={similarMovie.id}
                    whileHover={{ scale: 1.05 }}
                    className="cursor-pointer"
                    onClick={() => navigate(`/details/${similarMovie.id}`)}
                  >
                    <img
                      src={similarMovie.poster_path}
                      alt={similarMovie.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <p className="mt-2 font-semibold">{similarMovie.title}</p>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails; 