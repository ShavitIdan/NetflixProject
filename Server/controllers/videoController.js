const Video = require('../models/Video');
const Review = require('../models/Review');
const axios = require('axios');

// Get all videos
exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().populate('reviews');
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single video
exports.getVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate('reviews');
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get video details
exports.getVideoDetails = async (req, res) => {
  try {
    const { videoId } = req.params;

    // Try to find the video in our database
    let video = await Video.findOne({ tmdbId: videoId });
    
    if (!video) {
      // If video doesn't exist, return 404
      return res.status(404).json({ message: 'Video not found' });
    }

    res.json(video);
  } catch (error) {
    console.error('Error in getVideoDetails:', error);
    res.status(500).json({ 
      message: 'Error getting video details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Create video
exports.createVideo = async (req, res) => {
  try {
    const { tmdbId, title, media_type } = req.body;

    if (!tmdbId || !media_type) {
      return res.status(400).json({ message: 'TMDB ID and media type are required' });
    }

    // Check if video already exists
    const existingVideo = await Video.findOne({ tmdbId });
    if (existingVideo) {
      return res.status(200).json(existingVideo);
    }

    try {
      // Fetch video details from TMDB
      const tmdbResponse = await axios.get(
        `https://api.themoviedb.org/3/${media_type}/${tmdbId}?api_key=${process.env.TMDB_API_KEY}`
      );
      
      const tmdbData = tmdbResponse.data;
      const video = new Video({
        tmdbId,
        title: title || tmdbData.title || tmdbData.name,
        poster_path: tmdbData.poster_path,
        backdrop_path: tmdbData.backdrop_path,
        overview: tmdbData.overview,
        media_type
      });

      const newVideo = await video.save();
      res.status(201).json(newVideo);
    } catch (tmdbError) {
      console.error('Error fetching from TMDB:', tmdbError);
      // If TMDB fetch fails, create a basic video entry
      const video = new Video({
        tmdbId,
        title: title || `Video ${tmdbId}`,
        media_type
      });
      const newVideo = await video.save();
      res.status(201).json(newVideo);
    }
  } catch (error) {
    console.error('Error creating video:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update video
exports.updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    video.title = req.body.title || video.title;
    video.videoID = req.body.videoID || video.videoID;
    
    const updatedVideo = await video.save();
    res.json(updatedVideo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete video
exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    // Delete all reviews associated with this video
    await Review.deleteMany({ video: req.params.id });
    
    await video.remove();
    res.json({ message: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrCreateVideo = async (req, res) => {
  try {
    const { videoId, title } = req.body;

    if (!videoId || !title) {
      return res.status(400).json({ message: 'Video ID and title are required' });
    }

    // Try to find the video in our database
    let video = await Video.findOne({ videoID: videoId });

    // If video doesn't exist, create it
    if (!video) {
      video = new Video({
        videoID: videoId,
        title: title
      });

      await video.save();
      console.log('New video created:', video);
    }

    res.json(video);
  } catch (error) {
    console.error('Error in getOrCreateVideo:', error);
    res.status(500).json({ 
      message: 'Error getting video details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}; 