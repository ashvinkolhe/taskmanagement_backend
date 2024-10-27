const express = require('express');
const {
    createTask,
    getTaskById,
    getAllTasks,
    editTask,
    deleteTask,
    updateTaskState,
    getFilteredTasks,
    updateChecklistItem,
    assignTaskToUser
} = require('../controllers/taskController');

const { authenticate } = require('../middleware/auth');
const {
    validateCreateTask,
    validateUpdateTask,
    validateChecklistUpdate,
} = require('../validations/taskValidation');
const router = express.Router();

router.use(authenticate); // Protect all task routes

// Define filtered tasks route before the :id route
router.get('/filtered', authenticate, getFilteredTasks);

router.post('/create', validateCreateTask, createTask);
router.get('/', getAllTasks);

// Task-specific routes (this must come after all specific routes)
router.get('/:id', getTaskById);
router.patch('/:id', validateUpdateTask, editTask);
router.delete('/:id', deleteTask);

// Checklist update
router.patch('/:taskId/checklist/:checklistId', validateChecklistUpdate, updateChecklistItem);

// Task state update
router.patch('/:id/state', updateTaskState);

// Assign task to user
router.post('/:id/assign', assignTaskToUser); 

module.exports = router;
