const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key';

exports.protect = (req, res, next) => {
    let token;

    // 1. Check Authorization Header (Bearer)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    // 2. Check Cookies
    else if (req.cookies && req.cookies.auth_token) {
        token = req.cookies.auth_token;
    }

    if (!token) {
        return res.status(401).json({ error: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = { id: decoded.userId, email: decoded.email };
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(401).json({ error: 'Not authorized, token failed' });
    }
};
