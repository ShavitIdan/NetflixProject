const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getVideoDetails,
  createVideo

} = require('../controllers/videoController');


// Get video details
router.get('/:videoId', auth, getVideoDetails);

// Create video
router.post('/', auth, createVideo);

module.exports = router; 