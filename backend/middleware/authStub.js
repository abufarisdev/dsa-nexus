// Middleware to mock authentication and add a dummy user to the request
const authStub = (req, res, next) => {
    // Assume a fixed user ID for now
    req.user = {
        userId: '507f1f77bcf86cd799439011', // Valid Dummy ObjectId
        email: 'dev@example.com',
    };
    next();
};

module.exports = authStub;
