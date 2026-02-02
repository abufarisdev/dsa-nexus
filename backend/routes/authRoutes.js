const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// ONLY use functions that exist in your authController.js
router.post('/request-otp', authController.requestOTP);
router.post('/verify-otp', authController.verifyOTP);
router.post('/signup', authController.signup);
router.post('/logout', authController.logout);

// DO NOT add login or check-username routes - they don't exist yet!

module.exports = router;


// Add these functions at the END of your authController.js

// Check Username Availability (for signup)
exports.checkUsername = async (req, res) => {
  try {
    const { username } = req.query;
    
    if (!username || username.length < 3) {
      return res.json({ available: false });
    }
    
    const existingUser = await User.findOne({ username });
    res.json({ available: !existingUser });
    
  } catch (error) {
    console.error('Check username error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Traditional Email/Password Login
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Email/username and password required' });
    }
    
    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Set cookie
    res.cookie('auth_token', token, COOKIE_OPTIONS);
    
    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};