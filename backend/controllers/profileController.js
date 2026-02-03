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
            bio: { type: String, maxLength: 200, default: '' },
            about: { type: Object, default: {} },
            country: { type: String, default: '' },
            avatarUrl: { type: String, default: '' }
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

// Get About Me Content
exports.getAboutMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('profile.details.aboutMe');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const aboutMe = user.profile?.details?.aboutMe || {};
        const content = aboutMe.content || {}; // Return empty object if no content

        // If content is empty/missing, we might want to return a standard empty doc structure if we knew it
        // For now, returning the stored object or empty object as requested: "If no content exists: Return a valid empty editor document"
        // Tiptap's empty document is usually { type: 'doc', content: [] }
        // Let's ensure we return at least a basic doc structure if it is completely empty to avoid frontend crashes
        const finalContent = Object.keys(content).length === 0 ? { type: 'doc', content: [] } : content;

        res.json({
            content: finalContent
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update About Me Content
exports.updateAboutMe = async (req, res) => {
    const { content } = req.body;

    // Validate request body: Must be a valid editor document object
    if (!content || typeof content !== 'object' || Array.isArray(content)) {
        return res.status(400).json({ error: 'Invalid content format' });
    }

    // Basic Tiptap validation (optional but good): must have 'type': 'doc' usually
    // if (content.type !== 'doc') { ... } 
    // Allowing loose validation for now as "valid editor document object"

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Initialize path if not exists
        if (!user.profile) user.profile = {};
        if (!user.profile.details) user.profile.details = {};
        if (!user.profile.details.aboutMe) user.profile.details.aboutMe = {};

        user.profile.details.aboutMe.content = content;
        user.profile.details.aboutMe.lastUpdatedAt = new Date();

        await user.save();

        res.json({
            message: 'About Me updated successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
