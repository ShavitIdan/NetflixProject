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

exports.getUserProfiles = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all profiles for the user
    const profiles = await Profile.find({ user: userId }, 'name avatar');

    res.json({
      profiles: profiles.map(profile => ({
        name: profile.name,
        avatar: profile.avatar
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 