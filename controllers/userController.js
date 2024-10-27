const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register User
exports.register = async (req, res) => {
    const { Name, email, Password } = req.body; // Updated to match your request structure
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ status: 'error', message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(Password, 10);
        
        // Create a new user
        const newUser = new User({ Name, email, Password: hashedPassword });
        await newUser.save();
        
        res.status(201).json({ status: 'success', message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Login User
exports.login = async (req, res) => {
    const { email, Password } = req.body; // Updated to match your request structure
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        // Check password
        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch) {
            return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ status: 'success', message: 'Logged in successfully', token });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Update Password
exports.updatePassword = async (req, res) => {
    const { newPassword } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(req.user._id, { Password: hashedPassword }); // Ensure this matches your schema
        res.status(200).json({ status: 'success', message: 'Password updated successfully' });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

// Logout User
exports.logout = (req, res) => {
    // Here you can handle logout logic (e.g., invalidate token)
    res.status(200).json({ status: 'success', message: 'Logged out successfully' });
};
