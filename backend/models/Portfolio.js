const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },

    // Aggregated Stats
    totalSolved: { type: Number, default: 0 },

    // Unified Heatmap (Merged from all platforms)
    unifiedHeatmap: { type: Map, of: Number, default: {} },

    // Aggregated Skills (e.g. "Arrays": 50, "DP": 20)
    skills: { type: Map, of: Number, default: {} },

    // Platform Connection Status & high-level stats
    platforms: {
        leetcode: {
            connected: { type: Boolean, default: false },
            username: String,
            totalSolved: Number,
            lastUpdated: Date
        },
        github: {
            connected: { type: Boolean, default: false },
            username: String,
            lastUpdated: Date
        }
        // Add more platforms here
    },

    lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', PortfolioSchema);
