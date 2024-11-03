const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    Password: {  // Ensure this matches the login logic
        type: String,
        required: true
    },
    
});

module.exports = mongoose.model('User', userSchema);
