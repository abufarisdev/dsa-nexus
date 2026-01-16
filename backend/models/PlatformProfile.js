const mongoose = require('mongoose');

const PlatformProfileSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    platform: { type: String, required: true, enum: ['leetcode'] }, // Add 'github' later
    platformUsername: { type: String, required: true },
    platformProfileUrl: { type: String, default: '' },

    stats: {
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
        }
    },

    topics: { type: Map, of: Number, default: {} }, // e.g., "Arrays": 50

    heatmap: [{
        date: String, // YYYY-MM-DD
        submissions: Number
    }],

    awards: [{
        title: String,
        iconUrl: String,
        earnedAt: String // Date string or generic string
    }],

    lastSyncedAt: { type: Date, default: Date.now }
});

// Composite index to ensure unique platform profile per user
PlatformProfileSchema.index({ userId: 1, platform: 1 }, { unique: true });

module.exports = mongoose.model('PlatformProfile', PlatformProfileSchema);
