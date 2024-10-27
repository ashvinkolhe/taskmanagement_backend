const express = require('express');
const { register, login, updatePassword, logout } = require('../controllers/userController.js'); // Ensure the path is correct
const { validateRegister, validateLogin } = require('../validations/userValidation');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Define your routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.patch('/update-password', authenticate, updatePassword);
router.post('/logout', logout);

module.exports = router;
