const mongoose = require('mongoose');

const PlatformProfileSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    platform: { type: String, required: true, enum: ['leetcode', 'gfg'] }, // Add 'github' later
    platformUsername: { type: String, required: true },
    platformProfileUrl: { type: String, default: '' },

    stats: {
        totalSolved: { type: Number, default: 0 },
        difficulty: {
            school: { type: Number, default: 0 },
            basic: { type: Number, default: 0 },
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

    topics: { type: Map, of: Number, default: {} },

    profileMeta: {
        institute: { type: String, default: '' },
        codingScore: { type: String, default: '0' },
        rank: { type: String, default: '0' }
    },

    // Track which data points are available/valid for this platform
    // Values can be Boolean (true/false) or String ("partial")
    dataCompleteness: {
        totalSolved: { type: Boolean, default: true },
        difficulty: { type: Boolean, default: true },
        topics: { type: mongoose.Schema.Types.Mixed, default: true }, // Boolean or "partial"
        heatmap: { type: Boolean, default: true },
        activeDays: { type: Boolean, default: true },
        streaks: { type: Boolean, default: true }
    },

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
