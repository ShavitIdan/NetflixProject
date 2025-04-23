const User = require('../models/User');
const Profile = require('../models/Profile');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ email, password });
    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profiles: []
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ email, password, role: 'admin' });
    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Admin user registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profiles: []
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and populate profiles
    const user = await User.findOne({ email }).populate('profiles', 'name avatar');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profiles: user.profiles.map(profile => ({
          name: profile.name,
          avatar: profile.avatar
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).populate('profiles', 'name avatar');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    res.status(200).json({ 
      message: 'Token is valid',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profiles: user.profiles.map(profile => ({
          name: profile.name,
          avatar: profile.avatar
        }))
      }
    });
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    // Get the token from the authorization header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify the token and get the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Find the user with their profiles
    const user = await User.findById(userId)
      .populate('profiles', 'name avatar')
      .select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profiles: user.profiles.map(profile => ({
          id: profile._id,
          name: profile.name,
          avatar: profile.avatar
        }))
      }
    });
  } catch (error) {
    console.error('Get current user failed:', error);
    res.status(500).json({ message: error.message });
  }
}; 