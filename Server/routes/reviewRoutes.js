const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Review routes
router.post('/', reviewController.createReview);
router.get('/video/:videoId', reviewController.getVideoReviews);
router.put('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);

module.exports = router; 