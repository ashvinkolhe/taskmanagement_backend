const mongoose = require('mongoose');

const checklistSchema = new mongoose.Schema({
    text: { type: String, required: true },
    ischeck: { type: Boolean, default: false },
});

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    priority: {
        type: String,
        required: true,
        enum: ['Low', 'Medium', 'High'],
    },
    dueDate: {
        type: Date,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    checklist: [checklistSchema],
    state: {
        type: String,
        required: true,
        enum: ['Pending', 'ToDo', 'In Progress', 'Completed'],
    },
});

module.exports = mongoose.model('Task', taskSchema);
