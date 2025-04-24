import axios from 'axios';
import { API_BASE_URL } from '../config/api';

class TMDBService {
  async getPopularMovies(page = 1) {
    try {
      const response = await axios.get(`${API_BASE_URL}/tmdb/movies/popular?page=${page}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  }

  async getPopularTVShows(page = 1) {
    try {
      const response = await axios.get(`${API_BASE_URL}/tmdb/tv/popular?page=${page}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular TV shows:', error);
      throw error;
    }
  }

  async getNewestContent() {
    try {
      const response = await axios.get(`${API_BASE_URL}/tmdb/newest`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching newest content:', error);
      throw error;
    }
  }

  async getMostViewedInIsrael() {
    try {
      const response = await axios.get(`${API_BASE_URL}/tmdb/most-viewed-israel`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching most viewed in Israel:', error);
      throw error;
    }
  }

  async getTopRated() {
    try {
      const response = await axios.get(`${API_BASE_URL}/tmdb/top-rated`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching top rated content:', error);
      throw error;
    }
  }

  async getAnimatedContent() {
    try {
      const response = await axios.get(`${API_BASE_URL}/tmdb/animated`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching animated content:', error);
      throw error;
    }
  }

  async getActionContent() {
    try {
      const response = await axios.get(`${API_BASE_URL}/tmdb/action`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching action content:', error);
      throw error;
    }
  }

  async getMovieDetails(movieId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/tmdb/movie/${movieId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  }

  async getTVShowDetails(tvId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/tmdb/tv/${tvId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching TV show details:', error);
      throw error;
    }
  }
}

export default new TMDBService(); 