const { body, param, query, validationResult } = require('express-validator');

exports.validateCreateTask = [
    body('title').notEmpty().withMessage('Title is required'),
    body('priority').isIn(['Low', 'Medium', 'High']).withMessage('Priority must be Low, Medium, or High'),
    body('dueDate').isISO8601().withMessage('Due date must be a valid date'),
    body('state').isIn(['Pending', 'ToDo', 'In Progress', 'Completed']).withMessage('State must be Pending, ToDo, In Progress, or Completed'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

exports.validateUpdateTask = [
    param('id').isMongoId().withMessage('Invalid task ID'),
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('priority').optional().isIn(['Low', 'Medium', 'High']).withMessage('Priority must be Low, Medium, or High'),
    body('dueDate').optional().isISO8601().withMessage('Due date must be a valid date'),
    body('state').optional().isIn(['Pending', 'ToDo', 'In Progress', 'Completed']).withMessage('State must be Pending, ToDo, In Progress, or Completed'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

exports.validateChecklistUpdate = [
    param('taskId').isMongoId().withMessage('Invalid task ID'),
    param('checklistId').isMongoId().withMessage('Invalid checklist ID'),
    body('ischeck').isBoolean().withMessage('ischeck must be a boolean value'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];
