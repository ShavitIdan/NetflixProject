const express = require('express');
const router = express.Router();
const tmdbController = require('../controllers/tmdbController');
const auth = require('../middleware/auth');

// Apply authentication middleware to all TMDB routes
router.use(auth);

// Content category routes
router.get('/newest', tmdbController.getNewestContent);
router.get('/most-viewed-israel', tmdbController.getMostViewedInIsrael);
router.get('/top-rated', tmdbController.getTopRated);
router.get('/animated', tmdbController.getAnimatedContent);
router.get('/action', tmdbController.getActionContent);

// Detail routes
router.get('/movie/:movieId', tmdbController.getMovieDetails);
router.get('/tv/:tvId', tmdbController.getTVShowDetails);

module.exports = router; 