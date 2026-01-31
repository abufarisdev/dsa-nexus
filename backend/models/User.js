const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, unique: true, required: true, trim: true, lowercase: true },

    // Auth Fields
    passwordHash: { type: String }, // Required for password login
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    isEmailVerified: { type: Boolean, default: false },

    // Legacy/Profile Fields
    name: { type: String, default: '' }, // Kept for backward compat or aggregated name
    avatarUrl: { type: String, default: '' },
    bio: { type: String, default: '' },
    location: { type: String, default: '' },
    university: { type: String, default: '' },
    socialLinks: {
        github: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        twitter: { type: String, default: '' },
        website: { type: String, default: '' }
    },
    isPublicProfile: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

// Virtual for full name
UserSchema.virtual('fullName').get(function () {
    if (this.firstName && this.lastName) return `${this.firstName} ${this.lastName}`;
    return this.name;
});

module.exports = mongoose.model('User', UserSchema);
