const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
connectDB();

const app = express();

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:5173', // Allow your frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json()); // Parse JSON request body
app.use('/api/users', userRoutes); // User routes
app.use('/api/tasks', taskRoutes); // Task routes

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
