const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware'); // Assuming you have auth middleware

// Basic Info
router.get('/basic-info', protect, profileController.getBasicInfo);
router.put('/basic-info', protect, profileController.updateBasicInfo);

// About Me Section
router.get('/details/about', protect, profileController.getAboutMe);
router.put('/details/about', protect, profileController.updateAboutMe);

// Education Section
router.get('/details/education', protect, profileController.getEducation);
router.post('/details/education', protect, profileController.addEducation);
router.put('/details/education/:educationId', protect, profileController.updateEducation);
router.delete('/details/education/:educationId', protect, profileController.deleteEducation);

// Legacy/Other profile routes can be added here
// router.get('/:userId', ...);

module.exports = router;
