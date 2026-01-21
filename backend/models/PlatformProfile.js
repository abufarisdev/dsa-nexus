const mongoose = require('mongoose');

const PlatformProfileSchema = new mongoose.Schema({
    // specific to your User model usually
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    platform: { 
        type: String, 
        required: true, 
        enum: ['leetcode', 'github'] // Prepared for Github
    },
    platformUsername: { type: String, required: true },
    platformProfileUrl: { type: String, trim: true },

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

    // Using Map is perfect here for dynamic keys
    topics: { type: Map, of: Number, default: {} }, 

    // Changed date to Date type for better querying
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
    timestamps: true // Automatically adds createdAt and updatedAt
});

// Composite index to ensure unique platform profile per user
PlatformProfileSchema.index({ userId: 1, platform: 1 }, { unique: true });

module.exports = mongoose.model('PlatformProfile', PlatformProfileSchema);