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

// --- Education Section ---

// Get Education List
exports.getEducation = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('profile.details.education');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const education = user.profile?.details?.education || [];
        res.json({ education });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Add Education Entry
exports.addEducation = async (req, res) => {
    const { degree, institution, gradeType, gradeValue, startDate, endDate } = req.body;

    // Validation
    if (!degree || !institution || !gradeType || gradeValue === undefined) {
        return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Grade Validation
    if (gradeType === 'GPA' && gradeValue > 4) return res.status(400).json({ error: 'GPA must be <= 4' });
    if (gradeType === 'CGPA' && gradeValue > 10) return res.status(400).json({ error: 'CGPA must be <= 10' });
    if (gradeType === 'Percentage' && gradeValue > 100) return res.status(400).json({ error: 'Percentage must be <= 100' });

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Initialize path if not exists
        if (!user.profile) user.profile = {};
        if (!user.profile.details) user.profile.details = {};
        if (!user.profile.details.education) user.profile.details.education = [];

        const newEducation = {
            degree,
            institution,
            gradeType,
            gradeValue,
            startDate,
            endDate
        };

        user.profile.details.education.push(newEducation);
        await user.save();

        res.json({
            message: 'Education added successfully',
            education: user.profile.details.education
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update Education Entry
exports.updateEducation = async (req, res) => {
    const { educationId } = req.params;
    const { degree, institution, gradeType, gradeValue, startDate, endDate } = req.body;

    if (!educationId) return res.status(400).json({ error: 'Education ID required' });

    // Grade Validation if provided
    if (gradeType === 'GPA' && gradeValue > 4) return res.status(400).json({ error: 'GPA must be <= 4' });
    if (gradeType === 'CGPA' && gradeValue > 10) return res.status(400).json({ error: 'CGPA must be <= 10' });
    if (gradeType === 'Percentage' && gradeValue > 100) return res.status(400).json({ error: 'Percentage must be <= 100' });

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const educationEntry = user.profile.details.education.id(educationId);
        if (!educationEntry) {
            return res.status(404).json({ error: 'Education entry not found' });
        }

        // Update fields
        if (degree) educationEntry.degree = degree;
        if (institution) educationEntry.institution = institution;
        if (gradeType) educationEntry.gradeType = gradeType;
        if (gradeValue !== undefined) educationEntry.gradeValue = gradeValue;
        if (startDate) educationEntry.startDate = startDate;
        if (endDate) educationEntry.endDate = endDate;

        educationEntry.updatedAt = new Date();

        await user.save();

        res.json({
            message: 'Education updated successfully',
            education: user.profile.details.education
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete Education Entry
exports.deleteEducation = async (req, res) => {
    const { educationId } = req.params;

    if (!educationId) return res.status(400).json({ error: 'Education ID required' });

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.profile.details.education) {
            return res.status(404).json({ error: 'No education entries found' });
        }

        // Use pull to remove the subdocument
        user.profile.details.education.pull({ _id: educationId });
        await user.save();

        res.json({
            message: 'Education entry deleted',
            education: user.profile.details.education
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// --- Achievements Section ---

// Get Achievements List
exports.getAchievements = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('profile.details.achievements');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const achievements = user.profile?.details?.achievements || [];
        res.json({ achievements });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Add Achievement
exports.addAchievement = async (req, res) => {
    const { title, description, url, issueDate } = req.body;

    // Validation
    if (!title || !url) {
        return res.status(400).json({ error: 'Title and URL are required' });
    }

    // Google Drive URL Validation
    const googleDriveRegex = /^https?:\/\/(drive|docs)\.google\.com\/.*$/;
    if (!googleDriveRegex.test(url)) {
        return res.status(400).json({ error: 'URL must be a valid Google Drive link' });
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Initialize path if not exists
        if (!user.profile) user.profile = {};
        if (!user.profile.details) user.profile.details = {};
        if (!user.profile.details.achievements) user.profile.details.achievements = [];

        const newAchievement = {
            title,
            description: description || '',
            url,
            issueDate: issueDate || { month: '', year: null }
        };

        user.profile.details.achievements.push(newAchievement);
        await user.save();

        res.json({
            message: 'Achievement added successfully',
            achievements: user.profile.details.achievements
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update Achievement
exports.updateAchievement = async (req, res) => {
    const { achievementId } = req.params;
    const { title, description, url, issueDate } = req.body;

    if (!achievementId) return res.status(400).json({ error: 'Achievement ID required' });

    // Google Drive URL Validation if provided
    if (url) {
        const googleDriveRegex = /^https?:\/\/(drive|docs)\.google\.com\/.*$/;
        if (!googleDriveRegex.test(url)) {
            return res.status(400).json({ error: 'URL must be a valid Google Drive link' });
        }
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const achievement = user.profile.details.achievements.id(achievementId);
        if (!achievement) {
            return res.status(404).json({ error: 'Achievement not found' });
        }

        // Update fields
        if (title) achievement.title = title;
        if (description !== undefined) achievement.description = description;
        if (url) achievement.url = url;
        if (issueDate) achievement.issueDate = issueDate;

        achievement.updatedAt = new Date();

        await user.save();

        res.json({
            message: 'Achievement updated successfully',
            achievements: user.profile.details.achievements
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete Achievement
exports.deleteAchievement = async (req, res) => {
    const { achievementId } = req.params;

    if (!achievementId) return res.status(400).json({ error: 'Achievement ID required' });

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.profile.details.achievements) {
            return res.status(404).json({ error: 'No achievements found' });
        }

        // Use pull to remove the subdocument
        user.profile.details.achievements.pull({ _id: achievementId });
        await user.save();

        res.json({
            message: 'Achievement deleted',
            achievements: user.profile.details.achievements
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};


// --- Work Experience Section ---

// Get Work Experience List
exports.getWorkExperience = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('profile.details.workExperience');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const workExperience = user.profile?.details?.workExperience || [];
        res.json({ workExperience });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Add Work Experience
exports.addWorkExperience = async (req, res) => {
    const { jobTitle, company, description, startDate, endDate, isCurrentlyWorking } = req.body;

    // Validation
    if (!jobTitle || !company) {
        return res.status(400).json({ error: 'Job Title and Company are required' });
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Initialize path if not exists
        if (!user.profile) user.profile = {};
        if (!user.profile.details) user.profile.details = {};
        if (!user.profile.details.workExperience) user.profile.details.workExperience = [];

        const newExperience = {
            jobTitle,
            company,
            description: description || '',
            startDate: startDate || { month: '', year: null },
            endDate: isCurrentlyWorking ? null : (endDate || { month: '', year: null }),
            isCurrentlyWorking: !!isCurrentlyWorking
        };

        user.profile.details.workExperience.push(newExperience);
        await user.save();

        res.json({
            message: 'Work experience added successfully',
            workExperience: user.profile.details.workExperience
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update Work Experience
exports.updateWorkExperience = async (req, res) => {
    const { experienceId } = req.params;
    const { jobTitle, company, description, startDate, endDate, isCurrentlyWorking } = req.body;

    if (!experienceId) return res.status(400).json({ error: 'Experience ID required' });

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const experience = user.profile.details.workExperience.id(experienceId);
        if (!experience) {
            return res.status(404).json({ error: 'Work experience not found' });
        }

        // Update fields
        if (jobTitle) experience.jobTitle = jobTitle;
        if (company) experience.company = company;
        if (description !== undefined) experience.description = description;
        if (startDate) experience.startDate = startDate;

        if (isCurrentlyWorking !== undefined) {
            experience.isCurrentlyWorking = isCurrentlyWorking;
            if (isCurrentlyWorking) {
                experience.endDate = null;
            } else if (endDate) {
                experience.endDate = endDate;
            }
        } else if (endDate) {
            // If isCurrentlyWorking not passed but endDate is, assume implicit update
            experience.endDate = endDate;
        }

        experience.updatedAt = new Date();

        await user.save();

        res.json({
            message: 'Work experience updated successfully',
            workExperience: user.profile.details.workExperience
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete Work Experience
exports.deleteWorkExperience = async (req, res) => {
    const { experienceId } = req.params;

    if (!experienceId) return res.status(400).json({ error: 'Experience ID required' });

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.profile.details.workExperience) {
            return res.status(404).json({ error: 'No work experience found' });
        }

        // Use pull to remove the subdocument
        user.profile.details.workExperience.pull({ _id: experienceId });
        await user.save();

        res.json({
            message: 'Work experience deleted',
            workExperience: user.profile.details.workExperience
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

