const User = require('../models/User');
const countries = require('../config/countries');

// Get Basic Info
exports.getBasicInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('firstName lastName email profile');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email,
            bio: user.profile?.bio || '',
            country: user.profile?.country || ''
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update Basic Info
exports.updateBasicInfo = async (req, res) => {
    const { firstName, lastName, bio, country } = req.body;

    // Validation
    if (!firstName || firstName.trim() === '') {
        return res.status(400).json({ error: 'First name is required' });
    }
    if (bio && bio.length > 200) {
        return res.status(400).json({ error: 'Bio must be less than 200 characters' });
    }
    if (country && !countries.includes(country)) {
        return res.status(400).json({ error: 'Invalid country selected' });
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update fields
        user.firstName = firstName;
        user.lastName = lastName || '';

        // Initialize profile if not exists
        if (!user.profile) user.profile = {};

        user.profile.bio = bio || '';
        user.profile.country = country || '';

        await user.save();

        res.json({
            message: 'Basic information updated successfully',
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                bio: user.profile.bio,
                country: user.profile.country
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
