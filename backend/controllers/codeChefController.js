const axios = require('axios');
const cheerio = require('cheerio');
const PlatformProfile = require('../models/PlatformProfile');

// 1. The Scraper Logic (Updated with Debugging)
async function scrapeCodeChef(username) {
    try {
        const response = await axios.get(`https://www.codechef.com/users/${username}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const $ = cheerio.load(response.data);
        // Get all scripts in one big string
        const scripts = $('script').map((i, el) => $(el).html()).get().join(' ');

        // --- DEBUGGING START: Find out the real variable name ---
        // This will print the code around the word "solved" to your terminal
        const debugIndex = scripts.indexOf("all_problems_solved");
        if (debugIndex !== -1) {
            console.log("\n🔍 FOUND 'all_problems_solved' at index:", debugIndex);
            console.log("👉 CONTEXT:", scripts.substring(debugIndex - 50, debugIndex + 100));
        } else {
            console.log("\n❌ CRITICAL: 'all_problems_solved' NOT FOUND.");
            console.log("   Trying to find any variable with 'solved'...");
            const altIndex = scripts.indexOf("solved");
            if(altIndex !== -1) {
                console.log("   Alternative found:", scripts.substring(altIndex - 50, altIndex + 100));
            }
        }
        // --- DEBUGGING END ---

        // Basic Stats
        const rating = parseInt($('.rating-number').text(), 10) || 0;
        const maxRating = parseInt($('.rating-header small').text().match(/\d+/)?.[0], 10) || 0;
        const stars = $('.rating-star').text().trim() || "Unrated";
        const globalRank = parseInt($('.rating-ranks ul li:first-child a').text(), 10) || 0;
        const countryRank = parseInt($('.rating-ranks ul li:last-child a').text(), 10) || 0;

        // Total Solved (Robust Regex Method)
        let totalSolved = 0;
        
        // UPDATED REGEX: Matches "var", "let", or "const" just in case they changed it
        const solvedMatch = scripts.match(/(?:var|let|const)\s+all_problems_solved\s*=\s*(\[[\s\S]*?\]);/);
        
        if (solvedMatch && solvedMatch[1]) {
            try {
                const solvedData = JSON.parse(solvedMatch[1]);
                totalSolved = solvedData.length;
            } catch (e) {
                console.error("CodeChef Parse Error:", e.message);
            }
        }

        return {
            platform: 'codechef',
            username: username,
            rating,
            maxRating,
            rank: stars, 
            stars,       
            globalRank,
            countryRank,
            totalSolved,
            difficulty: { easy: 0, medium: 0, hard: 0 }
        };

    } catch (error) {
        console.error("Scraping Error:", error.message);
        return null;
    }
}

// 2. The Main Controller Function
exports.getCodeChefProfile = async (req, res) => {
    const { username } = req.params; // Get username from URL
    
    const data = await scrapeCodeChef(username);

    if (!data) {
        return res.status(404).json({ message: "CodeChef user not found or private" });
    }

    // FIX: Ensure we have a User ID. 
    // If req.user is missing (Postman testing), use a temporary ID or fail gracefully.
    const userIdToSave = req.user ? req.user.id : "111111111111111111111111"; 

    try {
        const profile = await PlatformProfile.findOneAndUpdate(
            { 
                userId: userIdToSave, 
                platform: 'codechef' 
            },
            {
                $set: {
                    platformUsername: data.username,
                    platformProfileUrl: `https://www.codechef.com/users/${data.username}`,
                    stats: {
                        rating: data.rating,
                        maxRating: data.maxRating,
                        rank: data.rank,
                        stars: data.stars,
                        globalRank: data.globalRank,
                        countryRank: data.countryRank,
                        totalSolved: data.totalSolved,
                        difficulty: data.difficulty
                    },
                    lastSyncedAt: new Date()
                }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.json(profile);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error saving profile" });
    }
};