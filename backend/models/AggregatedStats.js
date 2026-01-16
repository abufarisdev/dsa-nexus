const mongoose = require('mongoose');

const AggregatedStatsSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },

    totalQuestionsSolved: { type: Number, default: 0 },
    totalActiveDays: { type: Number, default: 0 },

    difficultyBreakdown: {
        easy: { type: Number, default: 0 },
        medium: { type: Number, default: 0 },
        hard: { type: Number, default: 0 }
    },

    streaks: {
        current: { type: Number, default: 0 },
        max: { type: Number, default: 0 }
    },

    platformsConnected: [{ type: String }], // e.g. ["leetcode"]

    lastCalculatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AggregatedStats', AggregatedStatsSchema);
