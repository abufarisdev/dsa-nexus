const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, unique: true, required: true, trim: true, lowercase: true },

    // Auth Fields
    passwordHash: { type: String }, // Required for password login
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    isEmailVerified: { type: Boolean, default: false },

    // Profile Fields
    profile: {
        bio: { type: String, maxLength: 200, default: '' },
        details: {
            aboutMe: {
                content: { type: Object, default: {} }, // rich-text JSON
                lastUpdatedAt: { type: Date }
            }
        },
        country: { type: String, default: '' },
        avatarUrl: { type: String, default: '' }
    },

    // Legacy mapping (optional, keeping for safety if used elsewhere, but ideally should rely on profile object)
    username: { type: String, required: true, unique: true, trim: true },
    createdAt: { type: Date, default: Date.now }
});

// Virtual for full name
UserSchema.virtual('fullName').get(function () {
    if (this.firstName && this.lastName) return `${this.firstName} ${this.lastName}`;
    return this.name;
});

module.exports = mongoose.model('User', UserSchema);
