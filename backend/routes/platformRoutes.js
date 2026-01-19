const express = require('express');
const router = express.Router();
const {
    getPortfolio,
    getLeetCodeProfile,
    addLeetCode,
    syncLeetCode,
    addGfg,
    syncGfg,
    getGfgProfile,
    removeGfg
} = require('../controllers/platformController');
const authStub = require('../middleware/authStub');

// Apply auth middleware to all routes (for now, even public ones require "being logged in" to access? 
// No, the user said GET is public. 
// BUT, my authStub attaches `req.user`. If I remove it for GET, `req.user` is undefined (fine for GET as it uses params).
// POST needs `req.user`.
// I will apply authStub mainly for POST, but maybe globally is fine if the stub just injects data. 
// However, typically public routes shouldn't require auth headers. 
// Since `authStub` just forces a user into request without checking headers, it's harmless for GET, but let's be cleaner.
// Actually, `authStub` is fine.
// I'll keep it simple: use authStub for everything to simulate "session" or just apply to POST.
// The user request implies "GET /portfolio/:userId" is for viewing *others*.
// I will apply authStub only to POST routes for correctness.

// Public Routes
router.get('/portfolio/:userId', getPortfolio);
router.get('/platforms/leetcode/:userId', getLeetCodeProfile);

// Protected Routes
router.use(authStub);
router.post('/platforms/leetcode', addLeetCode);
router.post('/platforms/leetcode/sync', syncLeetCode);

router.post('/platforms/gfg', addGfg);
router.post('/platforms/gfg/sync', syncGfg);
router.delete('/platforms/gfg', removeGfg);

// Public GFG Profile
router.get('/platforms/gfg/:userId', getGfgProfile);

module.exports = router;
