const mongoose = require('mongoose');

const LeetCodeProfileSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true }, // Link to User
    username: { type: String, required: true },

    // Profile Info
    profile: {
        realName: { type: String, default: '' },
        userAvatar: { type: String, default: '' },
        aboutMe: { type: String, default: '' },
        reputation: { type: Number, default: 0 },
        ranking: { type: Number, default: 0 },
        country: { type: String, default: '' },
    },

    // Solved Stats
    totalSolved: { type: Number, default: 0 },
    easySolved: { type: Number, default: 0 },
    mediumSolved: { type: Number, default: 0 },
    hardSolved: { type: Number, default: 0 },

    // Advanced Data
    submissionCalendar: { type: Map, of: Number, default: {} }, // Heatmap data
    totalActiveDays: { type: Number, default: 0 },
    maxStreak: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },

    tagProblemCounts: {
        advanced: [{ tagName: String, problemsSolved: Number }],
        intermediate: [{ tagName: String, problemsSolved: Number }],
        fundamental: [{ tagName: String, problemsSolved: Number }],
    },

    badges: [{
        displayName: String,
        icon: String,
        creationDate: String,
    }],

    recentSubmissions: [{
        title: String,
        titleSlug: String,
        timestamp: String,
        statusDisplay: String,
        lang: String,
    }],

    lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('LeetCodeProfile', LeetCodeProfileSchema);
