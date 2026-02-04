const mongoose = require('mongoose');

const PlatformProfileSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    platform: { 
        type: String, 
        required: true, 
        // UPDATED: Added 'codeforces' and 'codechef' to the allowed list
        enum: ['leetcode', 'github', 'codeforces', 'codechef'] 
    },
    platformUsername: { type: String, required: true },
    platformProfileUrl: { type: String, trim: true },

    stats: {
        // --- Shared / LeetCode Existing Fields ---
        totalSolved: { type: Number, default: 0 },
        difficulty: {
            easy: { type: Number, default: 0 },
            medium: { type: Number, default: 0 },
            hard: { type: Number, default: 0 }
        },
        totalActiveDays: { type: Number, default: 0 },
        submissionsCount: { type: Number, default: 0 },
        streaks: {
            current: { type: Number, default: 0 },
            max: { type: Number, default: 0 }
        },
        rating: { type: Number, default: 0 },       // Current contest rating
        maxRating: { type: Number, default: 0 },    // Highest rating ever achieved
        rank: { type: String, default: "Unrated" }, // e.g., "Guardian", "3 Star"
        
        // --- NEW: CodeChef Specifics ---
        stars: { type: String, default: "0★" },     // e.g., "4★"
        globalRank: { type: Number, default: 0 },
        countryRank: { type: Number, default: 0 }
    },

    // Using Map is perfect here for dynamic keys
    topics: { type: Map, of: Number, default: {} }, 

    heatmap: [{
        date: { type: Date, required: true }, 
        submissions: { type: Number, default: 0 }
    }],

    awards: [{
        title: String,
        iconUrl: String,
        earnedAt: Date 
    }],

    lastSyncedAt: { type: Date, default: Date.now }
}, {
    timestamps: true 
});

// Composite index to ensure unique platform profile per user
PlatformProfileSchema.index({ userId: 1, platform: 1 }, { unique: true });

module.exports = mongoose.model('PlatformProfile', PlatformProfileSchema);