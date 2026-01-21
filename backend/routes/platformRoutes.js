const express = require('express');
const router = express.Router();

// 1. Import existing LeetCode controllers
const {
    getPortfolio,
    getLeetCodeProfile,
    addLeetCode,
    syncLeetCode
} = require('../controllers/platformController');

// 2. Import your NEW Codeforces controllers
const {
    addCodeforces,
    syncCodeforces
} = require('../controllers/codeforcesController');

const authStub = require('../middleware/authStub');

// --- Public Routes ---
router.get('/portfolio/:userId', getPortfolio);
router.get('/platforms/leetcode/:userId', getLeetCodeProfile);

// --- Protected Routes ---
router.use(authStub);

// LeetCode Routes
router.post('/platforms/leetcode', addLeetCode);
router.post('/platforms/leetcode/sync', syncLeetCode);

// Codeforces Routes (NEW!)
router.post('/platforms/codeforces', addCodeforces);      // To save the handle
router.post('/platforms/codeforces/sync', syncCodeforces); // To fetch the data

module.exports = router;

