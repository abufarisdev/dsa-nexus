const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const EmailOTP = require('../models/EmailOTP');
const emailService = require('../services/emailService');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key';

// Generate 6 digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Cookie Options
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

// 1. Request OTP
exports.requestOTP = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    try {
        // Rate Limiting: Check if OTP exists and is recent ( < 1 min )
        const existingOTP = await EmailOTP.findOne({ email });
        if (existingOTP) {
            const timeDiff = Date.now() - new Date(existingOTP.createdAt).getTime();
            if (timeDiff < 60 * 1000) { // 1 minute
                return res.status(429).json({ error: 'Please wait 1 minute before requesting a new OTP.' });
            }
            // Delete old if allowed
            await EmailOTP.deleteOne({ _id: existingOTP._id });
        }

        const otp = generateOTP();
        const otpHash = await bcrypt.hash(otp, 10);

        // Create new OTP record
        await EmailOTP.create({
            email,
            otpHash,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 mins
        });

        // Send OTP
        await emailService.sendOTP(email, otp);

        res.json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Request OTP Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// 2. Verify OTP
exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and OTP required' });

    try {
        const record = await EmailOTP.findOne({ email });
        if (!record) return res.status(400).json({ error: 'Invalid or expired OTP' });

        const isMatch = await bcrypt.compare(otp, record.otpHash);
        if (!isMatch) {
            record.attempts += 1;
            await record.save();
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        // OTP Verified -> Delete
        await EmailOTP.deleteOne({ _id: record._id });

        // Check if user exists
        const user = await User.findOne({ email });

        if (user) {
            // Existing User -> Issue Login Token (Cookie)
            const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

            res.cookie('auth_token', token, COOKIE_OPTIONS);

            return res.json({
                signupRequired: false,
                loginAllowed: true,
                token, // Return token for client-side storage
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    avatarUrl: user.avatarUrl
                }
            });
        } else {
            // New User -> Require Signup
            // Verification token (Short lived)
            const verificationToken = jwt.sign({ email, verified: true }, JWT_SECRET, { expiresIn: '15m' });
            return res.json({
                signupRequired: true,
                loginAllowed: false,
                verificationToken
            });
        }
    } catch (error) {
        console.error('Verify OTP Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// 3. Signup
exports.signup = async (req, res) => {
    const { email, firstName, lastName, username, password, confirmPassword, verificationToken } = req.body;

    // Basic Validation
    if (!email || !username || !password || !verificationToken) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    try {
        // Verify token
        const payload = jwt.verify(verificationToken, JWT_SECRET);
        if (payload.email !== email || !payload.verified) {
            return res.status(403).json({ error: 'Email verification failed or token invalid' });
        }

        // Check uniqueness
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Email or Username already taken' });
        }

        // Hash Password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create User
        const newUser = await User.create({
            email,
            username,
            firstName,
            lastName,
            passwordHash,
            isEmailVerified: true,
            name: `${firstName} ${lastName}`.trim()
        });

        // Issue Login Token (Cookie)
        const token = jwt.sign({ userId: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

        res.cookie('auth_token', token, COOKIE_OPTIONS);

        res.status(201).json({
            message: 'Account created successfully',
            token, // Return token for client-side storage
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                avatarUrl: newUser.avatarUrl
            }
        });

    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ error: 'Server error or invalid token' });
    }
};

// 4. Logout
exports.logout = (req, res) => {
    res.clearCookie('auth_token', COOKIE_OPTIONS);
    res.json({ message: 'Logged out successfully' });
};
