const axios = require('axios');
const PlatformProfile = require('../models/PlatformProfile'); // <--- Using the Sidecar

// 1. Link Handle (Creates the empty Sidecar)
const addCodeforces = async (req, res) => {
    const { userId } = req.user;
    const { handle } = req.body;

    if (!handle) return res.status(400).json({ error: "Handle is required" });

    try {
        // Create or Update the profile with just the username for now
        await PlatformProfile.findOneAndUpdate(
            { userId, platform: 'codeforces' },
            { 
                $set: { platformUsername: handle } 
            },
            { upsert: true, new: true }
        );
        res.status(200).json({ message: "Codeforces handle linked successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to link handle" });
    }
};

// 2. Sync Data (Fills the Sidecar with Problems)
const syncCodeforces = async (req, res) => {
    const { userId } = req.user; 
    const { handle } = req.body; 

    if (!handle) return res.status(400).json({ error: "Handle is required" });

    try {
        console.log(`🔄 Syncing Codeforces for ${handle}...`);
        
        // A. Fetch from Codeforces
        const response = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}`, {
            timeout: 10000 
        });
        const submissions = response.data.result;

        // B. Process Data (Calculate Stats & List)
        const uniqueSolved = new Map();
        let easyCount = 0, mediumCount = 0, hardCount = 0;

        submissions.forEach(sub => {
            // We only care about problems that were successfully solved ("OK")
            if (sub.verdict === "OK" && sub.problem.rating) {
                const id = `${sub.problem.contestId}-${sub.problem.index}`;
                
                // Calculate difficulty counts based on Codeforces Ratings
                const rating = sub.problem.rating;
                if (rating < 1200) easyCount++;
                else if (rating < 1600) mediumCount++;
                else hardCount++;

                uniqueSolved.set(id, {
                    title: sub.problem.name,
                    difficulty: rating.toString(),
                    link: `https://codeforces.com/contest/${sub.problem.contestId}/problem/${sub.problem.index}`,
                    solvedAt: new Date(sub.creationTimeSeconds * 1000)
                });
            }
        });

        const solvedList = Array.from(uniqueSolved.values());

        // C. SAVE TO PLATFORM PROFILE
        await PlatformProfile.findOneAndUpdate(
            { userId, platform: 'codeforces' },
            {
                $set: {
                    platformUsername: handle,
                    stats: {
                        totalSolved: solvedList.length,
                        easy: easyCount,
                        medium: mediumCount,
                        hard: hardCount
                    },
                    solvedProblems: solvedList, // <--- The detailed list
                    lastSyncedAt: new Date()
                }
            },
            { upsert: true, new: true }
        );

        console.log("Saved to PlatformProfile collection!");

        res.status(200).json({
            success: true,
            totalSolved: solvedList.length,
            message: "Synced with PlatformProfile!",
            data: solvedList
        });

    } catch (error) {
        console.error("Sync Error:", error.message);
        res.status(500).json({ error: "Failed to sync data" });
    }
};

module.exports = { addCodeforces, syncCodeforces };