const { body, validationResult } = require('express-validator');

exports.validateRegister = [
    body('name').notEmpty().withMessage('Name is required'), // Change Name to name (lowercase)
    body('email').isEmail().withMessage('Invalid email address'),
    body('password') // Ensure password field is correctly validated
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .custom((value, { req }) => {
            if (value !== req.body.confirmPassword) {
                throw new Error('Passwords must match');
            }
            return true;
        }),
    body('confirmPassword')
        .notEmpty().withMessage('Confirm Password is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];


exports.validateLogin = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required'), // Changed Password to password
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];
