    const User = require('../models/userModel');
    const bcrypt = require('bcrypt');
    const jwt = require('jsonwebtoken');

    // Register User
    exports.register = async (req, res) => {
        const { name, email, password, confirmPassword } = req.body;
    
        // Check if password and confirmPassword match
        if (password !== confirmPassword) {
            return res.status(400).json({ status: 'error', message: 'Passwords must match' });
        }
    
        try {
            // Check if the email already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ status: 'error', message: 'User with this email already exists' });
            }
    
            // Hash the password before saving
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ name, email, password: hashedPassword });
    
            // Save the new user to the database
            await newUser.save();
    
            res.status(201).json({ status: 'success', message: 'User registered successfully' });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    };
    
    


// Login User
exports.login = async (req, res) => {
    const { email, password } = req.body;

    console.log('Request body:', req.body); // Log the incoming request body

    try {
        const user = await User.findOne({ email });
        console.log('Found user:', user); // Log the found user

        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        // Ensure the password exists and is valid
        if (!password || typeof password !== 'string') {
            return res.status(400).json({ status: 'error', message: 'Password must be provided' });
        }

        console.log('Password from request:', password); // Log the password from the request
        console.log('Password from database:', user.Password); // Use the correct property name

        const isMatch = await bcrypt.compare(password, user.Password); // Correct the property name to match the model
        if (!isMatch) {
            return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({
            status: 'success',
            message: 'Logged in successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
        });
    } catch (error) {
        console.error('Login error:', error); // Log the error for debugging
        res.status(500).json({ status: 'error', message: error.message });
    }
};





    // Update Password
    exports.updatePassword = async (req, res) => {
        const { newPassword } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await User.findByIdAndUpdate(req.user._id, { password: hashedPassword }); // Changed Password to password
            res.status(200).json({ status: 'success', message: 'Password updated successfully' });
        } catch (error) {
            console.error(error); // Log the error
            res.status(400).json({ status: 'error', message: error.message });
        }
    };

    // Logout User
    exports.logout = (req, res) => {
        res.status(200).json({ status: 'success', message: 'Logged out successfully' });
    };
