const AggregatedStats = require('../models/AggregatedStats');
const TopicStats = require('../models/TopicStats');
const PlatformProfile = require('../models/PlatformProfile');
const User = require('../models/User'); // Import User for profile info
const { fetchLeetCodeData } = require('../services/leetcodeService');
const { fetchGFGProfile } = require('../services/gfgService');
const { refreshPortfolio } = require('../services/aggregationService');

// @desc    Get public portfolio (Profile + Aggregated Stats)
// @route   GET /api/portfolio/:userId
// @access  Public
const getPortfolio = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findOne({ _id: userId }).select('-email -__v'); // Exclude private info if real auth used
        const stats = await AggregatedStats.findOne({ userId }).select('-__v');
        const topics = await TopicStats.findOne({ userId }).select('-__v');

        if (!stats) {
            return res.status(404).json({ message: 'Portfolio not found for this user' });
        }

        res.json({
            user: user || { userId }, // Fallback if user model not populated yet
            aggregatedStats: stats,
            topicStats: topics
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get public raw LeetCode profile
// @route   GET /api/platforms/leetcode/:userId
// @access  Public
const getLeetCodeProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const profile = await PlatformProfile.findOne({ userId, platform: 'leetcode' });

        if (!profile) {
            return res.status(404).json({ message: 'LeetCode profile not found' });
        }

        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add LeetCode username (First Link)
// @route   POST /api/platforms/leetcode
// @access  Private
const addLeetCode = async (req, res) => {
    const { username } = req.body;
    const userId = req.user.userId;

    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    try {
        await syncLeetCodeData(userId, username);
        res.json({ message: 'LeetCode linked and synced successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Manual resync LeetCode data
// @route   POST /api/platforms/leetcode/sync
// @access  Private
const syncLeetCode = async (req, res) => {
    const userId = req.user.userId;

    try {
        const existingProfile = await PlatformProfile.findOne({ userId, platform: 'leetcode' });

        if (!existingProfile) {
            return res.status(404).json({ message: 'LeetCode not linked yet. Use POST /platforms/leetcode first.' });
        }

        // Rate Limiting (e.g., 5 minutes)
        const FIVE_MINUTES = 5 * 60 * 1000;
        const lastSynced = new Date(existingProfile.lastSyncedAt).getTime();
        const now = Date.now();

        if (now - lastSynced < FIVE_MINUTES) {
            return res.status(429).json({
                message: 'Sync rate limit exceeded. Please wait 5 minutes.',
                nextSyncAvailable: new Date(lastSynced + FIVE_MINUTES)
            });
        }

        await syncLeetCodeData(userId, existingProfile.platformUsername);
        res.json({ message: 'LeetCode synced successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Add GFG username (First Link)
// @route   POST /api/platforms/gfg
// @access  Private
const addGfg = async (req, res) => {
    const { username } = req.body;
    const userId = req.user.userId;

    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    try {
        await syncGfgData(userId, username);
        res.json({ message: 'GFG linked and synced successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Manual resync GFG data
// @route   POST /api/platforms/gfg/sync
// @access  Private
const syncGfg = async (req, res) => {
    const userId = req.user.userId;

    try {
        const existingProfile = await PlatformProfile.findOne({ userId, platform: 'gfg' });

        if (!existingProfile) {
            return res.status(404).json({ message: 'GFG not linked yet. Use POST /platforms/gfg first.' });
        }

        // Rate Limiting (e.g., 5 minutes)
        const FIVE_MINUTES = 5 * 60 * 1000;
        const lastSynced = new Date(existingProfile.lastSyncedAt).getTime();
        const now = Date.now();

        if (now - lastSynced < FIVE_MINUTES) {
            return res.status(429).json({
                message: 'Sync rate limit exceeded. Please wait 5 minutes.',
                nextSyncAvailable: new Date(lastSynced + FIVE_MINUTES)
            });
        }

        await syncGfgData(userId, existingProfile.platformUsername);
        res.json({ message: 'GFG synced successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Get public raw GFG profile
// @route   GET /api/platforms/gfg/:userId
// @access  Public
const getGfgProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const profile = await PlatformProfile.findOne({ userId, platform: 'gfg' });

        if (!profile) {
            return res.status(404).json({ message: 'GFG profile not found' });
        }

        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Remove GFG platform
// @route   DELETE /api/platforms/gfg
// @access  Private
const removeGfg = async (req, res) => {
    const userId = req.user.userId;

    try {
        const result = await PlatformProfile.findOneAndDelete({ userId, platform: 'gfg' });

        if (!result) {
            return res.status(404).json({ message: 'GFG profile not found' });
        }

        // Recalculate portfolio after removal
        await refreshPortfolio(userId);

        res.json({ message: 'GFG profile removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Helper function to fetch, save, and aggregate
const syncLeetCodeData = async (userId, username) => {
    // 1. Fetch
    const data = await fetchLeetCodeData(username);

    // 2. Save
    await PlatformProfile.findOneAndUpdate(
        { userId, platform: 'leetcode' },
        {
            userId,
            platform: 'leetcode',
            platformUsername: data.platformUsername,
            platformProfileUrl: data.platformProfileUrl,
            stats: data.stats,
            topics: data.topics, // map used as object
            heatmap: data.heatmap,
            awards: data.awards,
            lastSyncedAt: new Date()
        },
        { upsert: true, new: true }
    );

    // 3. Aggregate
    await refreshPortfolio(userId);
};

const syncGfgData = async (userId, username) => {
    // 1. Fetch
    const data = await fetchGFGProfile(username);

    // 2. Save
    await PlatformProfile.findOneAndUpdate(
        { userId, platform: 'gfg' },
        {
            userId,
            platform: 'gfg',
            platformUsername: data.platformUsername,
            platformProfileUrl: data.platformProfileUrl,
            stats: data.stats,
            topics: data.topics,
            dataCompleteness: data.dataCompleteness,
            heatmap: data.heatmap,
            awards: data.awards,
            lastSyncedAt: new Date()
        },
        { upsert: true, new: true }
    );

    // 3. Aggregate
    await refreshPortfolio(userId);
};

module.exports = {
    getPortfolio,
    getLeetCodeProfile,
    addLeetCode,
    syncLeetCode,
    addGfg,
    syncGfg,
    getGfgProfile,
    removeGfg
};
