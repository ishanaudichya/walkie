const jwt = require('jsonwebtoken');
const User = require('../models/User');
const generateIdentityNo = require('../middleware/identityGenerator');

const register = async (req, res) => {
  try {
    const { email, password, nickname } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const identityNo = await generateIdentityNo();
    // Create new user
    const user = new User({
      email,
      password,
      nickname,
      identityNo
    });
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '50d' }
    );

    res.status(201).json({
      token,
      user: {
        email: user.email,
        nickname: user.nickname,
        identityNo: user.identityNo
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '50d' }
    );

    res.json({
      token,
      user: {
        email: user.email,
        nickname: user.nickname,
        identityNo: user.identityNo
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

module.exports = {
  register,
  login
}; 