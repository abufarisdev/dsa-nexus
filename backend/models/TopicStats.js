const mongoose = require('mongoose');

const TopicStatsSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },

    topics: { type: Map, of: Number, default: {} }, // e.g., "Arrays": 50, "DP": 20

    strongestTopic: { type: String, default: '' },
    weakestTopic: { type: String, default: '' }, // Could be "Graphs" (calculated logic needed)

    lastCalculatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TopicStats', TopicStatsSchema);
