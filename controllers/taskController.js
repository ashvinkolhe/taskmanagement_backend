const taskModel = require('../models/taskModel');
const moment = require('moment');

// Helper function to find task by ID and verify ownership
const findTaskById = async (id, userId, res) => {
    const task = await taskModel.findOne({ _id: id, user: userId });
    if (!task) {
        res.status(404).json({
            status: 'Failed',
            message: 'Task not found',
        });
        return null;
    }
    return task;
};

// Create task
const createTask = async (req, res) => {
    try {
        const { title, priority, dueDate, checklist, state } = req.body;

        const newTask = new taskModel({
            title,
            priority,
            dueDate,
            user: req.user._id, // Associate task with the logged-in user
            checklist,
            state,
        });

        await newTask.save();

        res.status(201).json({
            status: 'Success',
            message: 'Task created successfully',
            newTask,
        });
    } catch (error) {
        res.status(500).json({ status: 'Failed', message: error.message });
    }
};

// Assign task to a user
const assignTaskToUser = async (req, res) => {
    try {
        const task = await findTaskById(req.params.id, req.user._id, res);
        if (!task) return;

        const { userId } = req.body;
        task.user = userId; // Assign new user
        const updatedTask = await task.save();

        res.status(200).json({
            status: 'Success',
            message: 'Task assigned successfully',
            task: updatedTask,
        });
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: 'Failed to assign task',
            error: error.message,
        });
    }
};

// Get task by ID
const getTaskById = async (req, res) => {
    try {
        const task = await findTaskById(req.params.id, req.user._id, res);
        if (task) {
            res.status(200).json(task);
        }
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: 'Something went wrong!',
            error: error.message,
        });
    }
};

// Get all tasks for the authenticated user
const getAllTasks = async (req, res) => {
    try {
        const tasks = await taskModel.find({ user: req.user._id });
        if (tasks.length) {
            res.status(200).json(tasks);
        } else {
            res.status(404).json({
                status: 'Failed',
                message: 'No tasks found',
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: 'Something went wrong!',
            error: error.message,
        });
    }
};

// Edit task
const editTask = async (req, res) => {
    try {
        const updatedTaskData = req.body;
        const task = await taskModel.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            updatedTaskData,
            { new: true }
        );

        if (task) {
            res.status(200).json({
                status: 'Success',
                message: 'Task updated successfully',
                task,
            });
        } else {
            res.status(404).json({
                status: 'Failed',
                message: 'Task not found',
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: 'Something went wrong!',
            error: error.message,
        });
    }
};

// Delete task
const deleteTask = async (req, res) => {
    try {
        const task = await taskModel.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });

        if (task) {
            res.status(204).send(); // No content for 204 status code
        } else {
            res.status(404).json({
                status: 'Failed',
                message: 'Task not found',
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: 'Something went wrong!',
            error: error.message,
        });
    }
};

// Update task state
const updateTaskState = async (req, res) => {
    try {
        const task = await taskModel.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { state: req.body.state },
            { new: true }
        );

        if (task) {
            res.status(200).json({
                status: 'Success',
                task,
            });
        } else {
            res.status(404).json({
                status: 'Failed',
                message: 'Task not found',
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: 'Something went wrong!',
            error: error.message,
        });
    }
};

// Get filtered tasks for the authenticated user
const getFilteredTasks = async (req, res) => {
    try {
        const { filter } = req.query;
        const userId = req.user._id;

        let startDate, endDate;

        switch (filter) {
            case 'today':
                startDate = moment().startOf('day').toDate();
                endDate = moment().endOf('day').toDate();
                break;
            case 'thisWeek':
                startDate = moment().startOf('week').toDate();
                endDate = moment().endOf('week').toDate();
                break;
            case 'thisMonth':
                startDate = moment().startOf('month').toDate();
                endDate = moment().endOf('month').toDate();
                break;
            default:
                return res.status(400).json({
                    status: 'Failed',
                    message: 'Invalid filter value',
                });
        }

        const tasks = await taskModel.find({
            user: userId,
            dueDate: {
                $gte: startDate,
                $lte: endDate,
            },
        });

        if (tasks.length === 0) {
            return res.status(404).json({
                status: 'Success',
                message: 'No tasks found for the given filter.',
            });
        }

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: 'Something went wrong!',
            error: error.message,
        });
    }
};

// Update checklist item
const updateChecklistItem = async (req, res) => {
    try {
        const { taskId, checklistId } = req.params;
        const { ischeck } = req.body;

        const task = await findTaskById(taskId, req.user._id, res);
        if (!task) return;

        const checklistIndex = task.checklist.findIndex(
            (checklistItem) => checklistItem._id.toString() === checklistId
        );

        if (checklistIndex >= 0) {
            task.checklist[checklistIndex].ischeck = ischeck;
            const updatedTask = await task.save();
            res.status(200).json(updatedTask);
        } else {
            res.status(400).json({ message: 'Invalid checklist ID' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createTask,
    getTaskById,
    getAllTasks,
    editTask,
    deleteTask,
    updateTaskState,
    getFilteredTasks,
    updateChecklistItem,
    assignTaskToUser,
};