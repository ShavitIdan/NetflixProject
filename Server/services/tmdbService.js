const axios = require('axios');

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

class TMDBService {
  constructor() {
    this.apiKey = process.env.TMDB_KEY;
    this.accessToken = process.env.TMDB_TOKEN;
  }

  async getPopularMovies(page = 1) {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
        params: {
          api_key: this.apiKey,
          page,
          language: 'en-US'
        }
      });
      return this.formatMovieResponse(response.data);
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  }

  async getPopularTVShows(page = 1) {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/tv/popular`, {
        params: {
          api_key: this.apiKey,
          page,
          language: 'en-US'
        }
      });
      return this.formatTVResponse(response.data);
    } catch (error) {
      console.error('Error fetching popular TV shows:', error);
      throw error;
    }
  }

  async getMovieDetails(movieId) {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
        params: {
          api_key: this.apiKey,
          language: 'en-US',
          append_to_response: 'videos,credits,similar'
        }
      });
      return this.formatMovieDetails(response.data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  }

  async getTVShowDetails(tvId) {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/tv/${tvId}`, {
        params: {
          api_key: this.apiKey,
          language: 'en-US',
          append_to_response: 'videos,credits,similar'
        }
      });
      return this.formatTVDetails(response.data);
    } catch (error) {
      console.error('Error fetching TV show details:', error);
      throw error;
    }
  }

  async getNewestContent() {
    try {
      const [movies, tvShows] = await Promise.all([
        axios.get(`${TMDB_BASE_URL}/movie/now_playing`, {
          params: {
            api_key: this.apiKey,
            language: 'en-US',
            region: 'IL'
          }
        }),
        axios.get(`${TMDB_BASE_URL}/tv/on_the_air`, {
          params: {
            api_key: this.apiKey,
            language: 'en-US',
            region: 'IL'
          }
        })
      ]);

      const combinedResults = [
        ...movies.data.results.map(movie => ({ ...movie, media_type: 'movie' })),
        ...tvShows.data.results.map(show => ({ ...show, media_type: 'tv' }))
      ].sort((a, b) => new Date(b.release_date || b.first_air_date) - new Date(a.release_date || a.first_air_date));

      return this.formatResponse(combinedResults.slice(0, 10));
    } catch (error) {
      console.error('Error fetching newest content:', error);
      throw error;
    }
  }

  async getMostViewedInIsrael() {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/trending/all/week`, {
        params: {
          api_key: this.apiKey,
          language: 'en-US',
          region: 'IL'
        }
      });
      return this.formatResponse(response.data.results.slice(0, 10));
    } catch (error) {
      console.error('Error fetching most viewed in Israel:', error);
      throw error;
    }
  }

  async getTopRated() {
    try {
      const [movies, tvShows] = await Promise.all([
        axios.get(`${TMDB_BASE_URL}/movie/top_rated`, {
          params: {
            api_key: this.apiKey,
            language: 'en-US',
            region: 'IL'
          }
        }),
        axios.get(`${TMDB_BASE_URL}/tv/top_rated`, {
          params: {
            api_key: this.apiKey,
            language: 'en-US',
            region: 'IL'
          }
        })
      ]);

      const combinedResults = [
        ...movies.data.results.map(movie => ({ ...movie, media_type: 'movie' })),
        ...tvShows.data.results.map(show => ({ ...show, media_type: 'tv' }))
      ].sort((a, b) => b.vote_average - a.vote_average);

      return this.formatResponse(combinedResults.slice(0, 10));
    } catch (error) {
      console.error('Error fetching top rated content:', error);
      throw error;
    }
  }

  async getAnimatedContent() {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
        params: {
          api_key: this.apiKey,
          language: 'en-US',
          region: 'IL',
          with_genres: '16', // Animation genre ID
          sort_by: 'popularity.desc'
        }
      });
      return this.formatResponse(response.data.results.slice(0, 10));
    } catch (error) {
      console.error('Error fetching animated content:', error);
      throw error;
    }
  }

  async getActionContent() {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
        params: {
          api_key: this.apiKey,
          language: 'en-US',
          region: 'IL',
          with_genres: '28', // Action genre ID
          sort_by: 'popularity.desc'
        }
      });
      return this.formatResponse(response.data.results.slice(0, 10));
    } catch (error) {
      console.error('Error fetching action content:', error);
      throw error;
    }
  }

  formatMovieResponse(data) {
    return {
      ...data,
      results: data.results.map(movie => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        poster_path: `${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}`,
        backdrop_path: `${TMDB_IMAGE_BASE_URL}/original${movie.backdrop_path}`,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        media_type: 'movie'
      }))
    };
  }

  formatTVResponse(data) {
    return {
      ...data,
      results: data.results.map(tv => ({
        id: tv.id,
        name: tv.name,
        overview: tv.overview,
        poster_path: `${TMDB_IMAGE_BASE_URL}/w500${tv.poster_path}`,
        backdrop_path: `${TMDB_IMAGE_BASE_URL}/original${tv.backdrop_path}`,
        first_air_date: tv.first_air_date,
        vote_average: tv.vote_average,
        media_type: 'tv'
      }))
    };
  }

  formatMovieDetails(data) {
    return {
      id: data.id,
      title: data.title,
      overview: data.overview,
      poster_path: `${TMDB_IMAGE_BASE_URL}/w500${data.poster_path}`,
      backdrop_path: `${TMDB_IMAGE_BASE_URL}/original${data.backdrop_path}`,
      release_date: data.release_date,
      vote_average: data.vote_average,
      runtime: data.runtime,
      genres: data.genres,
      videos: data.videos?.results || [],
      credits: {
        cast: data.credits?.cast.slice(0, 10) || [],
        crew: data.credits?.crew.slice(0, 5) || []
      },
      similar: this.formatMovieResponse({ results: data.similar?.results || [] }).results,
      media_type: 'movie'
    };
  }

  formatTVDetails(data) {
    return {
      id: data.id,
      name: data.name,
      overview: data.overview,
      poster_path: `${TMDB_IMAGE_BASE_URL}/w500${data.poster_path}`,
      backdrop_path: `${TMDB_IMAGE_BASE_URL}/original${data.backdrop_path}`,
      first_air_date: data.first_air_date,
      vote_average: data.vote_average,
      number_of_seasons: data.number_of_seasons,
      number_of_episodes: data.number_of_episodes,
      genres: data.genres,
      videos: data.videos?.results || [],
      credits: {
        cast: data.credits?.cast.slice(0, 10) || [],
        crew: data.credits?.crew.slice(0, 5) || []
      },
      similar: this.formatTVResponse({ results: data.similar?.results || [] }).results,
      media_type: 'tv'
    };
  }

  formatResponse(items) {
    return items.map(item => ({
      id: item.id,
      title: item.title || item.name,
      overview: item.overview,
      poster_path: `${TMDB_IMAGE_BASE_URL}/w500${item.poster_path}`,
      backdrop_path: `${TMDB_IMAGE_BASE_URL}/original${item.backdrop_path}`,
      release_date: item.release_date || item.first_air_date,
      vote_average: item.vote_average,
      media_type: item.media_type
    }));
  }
}

module.exports = new TMDBService(); 