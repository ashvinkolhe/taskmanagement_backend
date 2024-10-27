const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const dotenv = require('dotenv');

dotenv.config();
connectDB();

const app = express();

app.use(express.json()); // Parse JSON request body
app.use('/api/users', userRoutes); // User routes
app.use('/api/tasks', taskRoutes); // Task routes

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
