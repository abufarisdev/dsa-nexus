const express = require('express');
const router = express.Router();

// 1. Import existing LeetCode controllers
const {
    getPortfolio,
    getLeetCodeProfile,
    addLeetCode,
    syncLeetCode
} = require('../controllers/platformController');

// 2. Import Codeforces controllers
const {
    addCodeforces,
    syncCodeforces
} = require('../controllers/codeforcesController');

// 3. Import NEW CodeChef controller
// We reuse 'getCodeChefProfile' for syncing because it scrapes & saves simultaneously
const {
    getCodeChefProfile
} = require('../controllers/codeChefController');

const authStub = require('../middleware/authStub');

// --- Public Routes ---
router.get('/portfolio/:userId', getPortfolio);
router.get('/platforms/leetcode/:userId', getLeetCodeProfile);
// Optional: Public read-only route for CodeChef if you need it
// router.get('/platforms/codechef/:username', getCodeChefProfile);

// --- Protected Routes ---
router.use(authStub);

// LeetCode Routes
router.post('/platforms/leetcode', addLeetCode);
router.post('/platforms/leetcode/sync', syncLeetCode);

// Codeforces Routes
router.post('/platforms/codeforces', addCodeforces);       // To save the handle
router.post('/platforms/codeforces/sync', syncCodeforces); // To fetch the data

// CodeChef Routes (NEW!)
// Since getCodeChefProfile expects a username in the URL (req.params.username), 
// we include :username here.
router.post('/platforms/codechef/:username', getCodeChefProfile); 

module.exports = router;