const mongoose = require('mongoose');

const githubStatsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    githubUsername: {
        type: String,
        required: true
    },
    profileUrl: {
        type: String,
        required: true
    },
    auth: {
        tokenEncrypted: {
            type: String,
            required: true
        },
        iv: { // Initialization vector for encryption
            type: String,
            required: true
        },
        tokenLastUpdated: {
            type: Date,
            default: Date.now
        }
    },
    summary: {
        totalContributions: { type: Number, default: 0 },
        totalActiveDays: { type: Number, default: 0 },
        totalCommits: { type: Number, default: 0 },
        totalPRs: { type: Number, default: 0 },
        totalIssues: { type: Number, default: 0 },
        totalStarsGiven: { type: Number, default: 0 }
    },
    heatmap: [
        {
            date: { type: String, required: true }, // YYYY-MM-DD
            count: { type: Number, required: true }
        }
    ],
    languages: {
        type: Map,
        of: Number // Storing usage as byte count or percentage
    },
    repos: {
        totalPublic: { type: Number, default: 0 },
        totalPrivate: { type: Number, default: 0 }
    },
    lastSyncedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('GitHubStats', githubStatsSchema);
