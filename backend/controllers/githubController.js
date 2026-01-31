const GitHubStats = require('../models/GitHubStats');
const githubService = require('../services/githubService');

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
// Frontend URL to redirect back to after success (can be configurable)
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// 1. Initiate OAuth Flow
exports.connectGitHub = (req, res) => {
    const redirectUri = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=read:user,repo`;
    res.json({ url: redirectUri });
};

// 2. Handle OAuth Callback
exports.githubCallback = async (req, res) => {
    const { code } = req.query;
    const userId = req.user.userId; // Matches authStub

    if (!code) {
        return res.status(400).json({ error: 'No code provided' });
    }

    try {
        // Exchange code for token
        const token = await githubService.exchangeCodeForToken(code);

        // Encrypt token
        const { encryptedData, iv } = githubService.encryptToken(token);

        // Fetch initial stats
        const stats = await githubService.fetchGitHubStats(token);

        // Save/Update in DB
        const updateData = {
            userId,
            githubUsername: stats.githubUsername,
            profileUrl: stats.profileUrl,
            auth: {
                tokenEncrypted: encryptedData,
                iv: iv,
                tokenLastUpdated: new Date()
            },
            summary: stats.summary,
            heatmap: stats.heatmap,
            languages: stats.languages,
            repos: stats.repos,
            lastSyncedAt: new Date()
        };

        await GitHubStats.findOneAndUpdate(
            { userId },
            updateData,
            { upsert: true, new: true }
        );

        // Redirect to frontend (success)
        // We might want to include a query param to indicate success
        res.redirect(`${FRONTEND_URL}/dashboard?githubContent=success`);

    } catch (error) {
        console.error('GitHub Callback Error:', error);
        res.redirect(`${FRONTEND_URL}/dashboard?githubContent=error&message=${encodeURIComponent(error.message)}`);
    }
};

// 3. Get Cached Stats
exports.getGitHubStats = async (req, res) => {
    try {
        let userId;

        // If :userId param is present, use it (Public/Admin view)
        if (req.params.userId) {
            userId = req.params.userId;
        } else {
            // Otherwise use logged-in user
            userId = req.user && req.user.userId;
        }

        if (!userId) {
            return res.status(400).json({ error: 'User ID required' });
        }

        const stats = await GitHubStats.findOne({ userId }).select('-auth'); // Exclude sensitive auth data

        if (!stats) {
            return res.status(404).json({ message: 'GitHub stats not found.' });
        }

        res.json(stats);
    } catch (error) {
        console.error('Get GitHub Stats Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// 5. Disconnect GitHub (Revoke & Delete)
exports.disconnectGitHub = async (req, res) => {
    try {
        const userId = req.user.userId;
        const statsEntry = await GitHubStats.findOne({ userId });

        if (!statsEntry) {
            return res.status(404).json({ error: 'No GitHub account connected' });
        }

        // 1. Try to revoke token
        if (statsEntry.auth && statsEntry.auth.tokenEncrypted) {
            const token = githubService.decryptToken(statsEntry.auth.tokenEncrypted, statsEntry.auth.iv);
            await githubService.revokeToken(token);
        }

        // 2. Delete from DB
        await GitHubStats.findOneAndDelete({ userId });

        res.json({ message: 'GitHub account disconnected and data removed.' });

    } catch (error) {
        console.error('Disconnect GitHub Error:', error);
        res.status(500).json({ error: 'Server error during disconnect' });
    }
};

// 4. Force Sync (Optional but good to have)
exports.syncGitHubStats = async (req, res) => {
    try {
        const userId = req.user.userId;
        const statsEntry = await GitHubStats.findOne({ userId });

        if (!statsEntry) {
            return res.status(404).json({ error: 'No GitHub account connected' });
        }

        // Decrypt token
        const token = githubService.decryptToken(statsEntry.auth.tokenEncrypted, statsEntry.auth.iv);

        // Fetch new stats
        const newStats = await githubService.fetchGitHubStats(token);

        // Update DB
        statsEntry.summary = newStats.summary;
        statsEntry.heatmap = newStats.heatmap;
        statsEntry.languages = newStats.languages;
        statsEntry.repos = newStats.repos;
        statsEntry.lastSyncedAt = new Date();

        await statsEntry.save();

        res.json({ message: 'Synced successfully', data: statsEntry });

    } catch (error) {
        console.error('Sync GitHub Stats Error:', error);
        res.status(500).json({ error: 'Sync failed: ' + error.message });
    }
};
