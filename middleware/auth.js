const jwt = require('jsonwebtoken'); 
const User = require('../models/userModel');

// Middleware to authenticate users using JWT
exports.authenticate = async (req, res, next) => {
    // Extract token from Authorization header
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ status: 'error', message: 'No token provided' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user by ID and attach to request
        req.user = await User.findById(decoded.id);
        if (!req.user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Log error for debugging
        console.error('JWT Error:', error);

        // Send response indicating unauthorized access
        res.status(401).json({ status: 'error', message: 'Unauthorized access' });
    }
};
