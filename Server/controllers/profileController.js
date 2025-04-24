const Profile = require('../models/Profile');
const User = require('../models/User');

exports.createProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const userId = req.user._id;

    // Check if user exists and get their current profile count
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has reached max profiles
    if (user.profiles.length >= user.maxProfiles) {
      return res.status(400).json({ message: 'Maximum number of profiles reached' });
    }

    // Create new profile
    const profile = new Profile({
      name,
      avatar: avatar || 'default-avatar.png',
      user: userId
    });

    await profile.save();

    // Add profile to user's profiles array
    user.profiles.push(profile._id);
    await user.save();

    res.status(201).json({
      message: 'Profile created successfully',
      profile: {
        id: profile._id,
        name: profile.name,
        avatar: profile.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const { profileId } = req.params;
    const userId = req.user._id;

    // Find and update profile
    const profile = await Profile.findOneAndUpdate(
      { _id: profileId, user: userId },
      { name, avatar },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      profile: {
        name: profile.name,
        avatar: profile.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    const { profileId } = req.params;
    const userId = req.user._id;

    // Find and delete profile
    const profile = await Profile.findOneAndDelete({ _id: profileId, user: userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Remove profile from user's profiles array
    await User.findByIdAndUpdate(userId, {
      $pull: { profiles: profileId }
    });

    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.selectProfile = async (req, res) => {
  try {
    const { profileId } = req.params;
    const userId = req.user._id;

    // First, unselect all profiles for this user
    await Profile.updateMany(
      { user: userId },
      { isSelected: false }
    );

    // Then select the requested profile
    const profile = await Profile.findOneAndUpdate(
      { _id: profileId, user: userId },
      { isSelected: true },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ 
        success: false,
        message: 'Profile not found' 
      });
    }

    res.status(200).json({ 
      success: true,
      message: 'Profile selected successfully',
      profile 
    });
  } catch (error) {
    console.error('Error selecting profile:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

exports.getUserProfiles = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all profiles for the user
    const profiles = await Profile.find({ user: userId });

    res.json({
      profiles: profiles.map(profile => ({
        id: profile._id,
        name: profile.name,
        avatar: profile.avatar,
        isSelected: profile.isSelected,
        savedVideos: profile.savedVideos || []
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.saveVideo = async (req, res) => {
  try {
    const { videoId, title, poster, poster_path, backdrop_path, overview } = req.body;
    const userId = req.user._id;

    if (!videoId) {
      return res.status(400).json({ message: 'Video ID is required' });
    }

    // Find the selected profile for the user
    const profile = await Profile.findOne({ user: userId, isSelected: true });
    if (!profile) {
      return res.status(404).json({ message: 'No selected profile found' });
    }

    // Check if video is already saved using a more robust comparison
    const existingVideo = profile.savedVideos.find(v => v.id.toString() === videoId.toString());
    if (existingVideo) {
      return res.status(200).json({ 
        success: true,
        message: 'Video already saved',
        profile 
      });
    }

    // Add video to savedVideos array with full details
    profile.savedVideos.push({
      id: videoId,
      title,
      poster: poster || `https://image.tmdb.org/t/p/w500${poster_path}`,
      poster_path,
      backdrop_path,
      overview
    });
    await profile.save();

    res.status(200).json({ 
      success: true,
      message: 'Video saved successfully',
      profile 
    });
  } catch (error) {
    console.error('Error saving video:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

exports.removeVideo = async (req, res) => {
  try {
    const { videoId } = req.body;
    const userId = req.user._id;

    if (!videoId) {
      return res.status(400).json({ 
        success: false,
        message: 'Video ID is required' 
      });
    }

    // Find the selected profile for the user
    const profile = await Profile.findOne({ user: userId, isSelected: true });
    if (!profile) {
      return res.status(404).json({ 
        success: false,
        message: 'No selected profile found' 
      });
    }

    // Remove video from savedVideos array
    profile.savedVideos = profile.savedVideos.filter(v => v.id.toString() !== videoId.toString());
    await profile.save();

    res.status(200).json({ 
      success: true,
      message: 'Video removed successfully',
      profile 
    });
  } catch (error) {
    console.error('Error removing video:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};