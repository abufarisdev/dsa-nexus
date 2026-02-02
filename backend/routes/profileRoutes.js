const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware'); // Assuming you have auth middleware

// Basic Info
router.get('/basic-info', protect, profileController.getBasicInfo);
router.put('/basic-info', protect, profileController.updateBasicInfo);

// Legacy/Other profile routes can be added here
// router.get('/:userId', ...);

module.exports = router;
