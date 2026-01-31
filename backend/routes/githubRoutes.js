const express = require('express');
const router = express.Router();
const githubController = require('../controllers/githubController');
const authStub = require('../middleware/authStub'); // Or real auth middleware

// Protected routes (require login)
router.use(authStub);

// GET /api/devStats/github/:userId? -> Returns stats (Supporting optional param if we want, or strict sub-route)
// Actually, to avoid conflict with /auth, /callback, we should place specific routes first.

// GET /api/devStats/github/auth -> Returns redirect URL
router.get('/auth', githubController.connectGitHub);

// GET /api/devStats/github/callback -> Handles OAuth callback
router.get('/callback', githubController.githubCallback);

// POST /api/devStats/github/sync -> Force refresh
router.post('/sync', githubController.syncGitHubStats);

// DELETE /api/devStats/github -> Disconnect
router.delete('/', githubController.disconnectGitHub);

// GET /api/devStats/github/:userId -> Returns stats for specific user
router.get('/:userId', githubController.getGitHubStats);

// GET /api/devStats/github -> Returns stats for current user (if no ID provided, currently handled by same controller logic if using optional param, but express routes are strict)
router.get('/', githubController.getGitHubStats);

module.exports = router;
