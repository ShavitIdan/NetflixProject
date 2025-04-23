const tmdbService = require('../services/tmdbService');

const getPopularMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const movies = await tmdbService.getPopularMovies(page);
    res.json(movies);
  } catch (error) {
    console.error('Error in getPopularMovies:', error);
    res.status(500).json({ message: 'Error fetching popular movies' });
  }
};

const getPopularTVShows = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const tvShows = await tmdbService.getPopularTVShows(page);
    res.json(tvShows);
  } catch (error) {
    console.error('Error in getPopularTVShows:', error);
    res.status(500).json({ message: 'Error fetching popular TV shows' });
  }
};

const getMovieDetails = async (req, res) => {
  try {
    const { movieId } = req.params;
    const movie = await tmdbService.getMovieDetails(movieId);
    res.json(movie);
  } catch (error) {
    console.error('Error in getMovieDetails:', error);
    res.status(500).json({ message: 'Error fetching movie details' });
  }
};

const getTVShowDetails = async (req, res) => {
  try {
    const { tvId } = req.params;
    const tvShow = await tmdbService.getTVShowDetails(tvId);
    res.json(tvShow);
  } catch (error) {
    console.error('Error in getTVShowDetails:', error);
    res.status(500).json({ message: 'Error fetching TV show details' });
  }
};

const getNewestContent = async (req, res) => {
  try {
    const content = await tmdbService.getNewestContent();
    res.json(content);
  } catch (error) {
    console.error('Error in getNewestContent:', error);
    res.status(500).json({ message: 'Error fetching newest content' });
  }
};

const getMostViewedInIsrael = async (req, res) => {
  try {
    const content = await tmdbService.getMostViewedInIsrael();
    res.json(content);
  } catch (error) {
    console.error('Error in getMostViewedInIsrael:', error);
    res.status(500).json({ message: 'Error fetching most viewed content in Israel' });
  }
};

const getTopRated = async (req, res) => {
  try {
    const content = await tmdbService.getTopRated();
    res.json(content);
  } catch (error) {
    console.error('Error in getTopRated:', error);
    res.status(500).json({ message: 'Error fetching top rated content' });
  }
};

const getAnimatedContent = async (req, res) => {
  try {
    const content = await tmdbService.getAnimatedContent();
    res.json(content);
  } catch (error) {
    console.error('Error in getAnimatedContent:', error);
    res.status(500).json({ message: 'Error fetching animated content' });
  }
};

const getActionContent = async (req, res) => {
  try {
    const content = await tmdbService.getActionContent();
    res.json(content);
  } catch (error) {
    console.error('Error in getActionContent:', error);
    res.status(500).json({ message: 'Error fetching action content' });
  }
};

module.exports = {
  getPopularMovies,
  getPopularTVShows,
  getMovieDetails,
  getTVShowDetails,
  getNewestContent,
  getMostViewedInIsrael,
  getTopRated,
  getAnimatedContent,
  getActionContent
}; 