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
            },
            achievements: [{
                title: { type: String, required: true, trim: true },
                description: { type: String, trim: true },
                url: { type: String, required: true, trim: true },
                issueDate: {
                    month: { type: String },
                    year: { type: Number }
                },
                createdAt: { type: Date, default: Date.now },
                updatedAt: { type: Date }
            }],
            education: [{
                degree: { type: String, required: true },
                institution: { type: String, required: true },
                gradeType: { type: String, enum: ['GPA', 'Percentage', 'CGPA'], required: true },
                gradeValue: { type: Number, required: true },
                startDate: {
                    month: { type: String },
                    year: { type: Number }
                },
                endDate: {
                    month: { type: String },
                    year: { type: Number }
                },
                createdAt: { type: Date, default: Date.now },
                createdAt: { type: Date, default: Date.now },
                updatedAt: { type: Date }
            }],
            workExperience: [{
                jobTitle: { type: String, required: true, trim: true },
                company: { type: String, required: true, trim: true },
                description: { type: String, trim: true },
                startDate: {
                    month: { type: String },
                    year: { type: Number }
                },
                endDate: {
                    month: { type: String },
                    year: { type: Number }
                },
                isCurrentlyWorking: { type: Boolean, default: false },
                isCurrentlyWorking: { type: Boolean, default: false },
                createdAt: { type: Date, default: Date.now },
                updatedAt: { type: Date }
            }],
            socials: {
                linkedin: { type: String, trim: true, default: '' },
                twitter: { type: String, trim: true, default: '' },
                website: { type: String, trim: true, default: '' },
                resume: { type: String, trim: true, default: '' },
                updatedAt: { type: Date }
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
