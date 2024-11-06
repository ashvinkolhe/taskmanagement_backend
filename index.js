const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

dotenv.config();
connectDB();

const app = express();

// Use body-parser to parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS Configuration for multiple origins
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://taskmanagement-frontend-vyf6.vercel.app',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

// Define API routes
app.use('/api/users', userRoutes); // User routes
app.use('/api/tasks', taskRoutes); // Task routes

// Root endpoint to check server status
app.get('/', (req, res) => {
  let time = new Date().toLocaleTimeString();
  res.json({
    time: time,
    app: 'TaskManagement',
    state: 'Active',
    message: 'All good!',
  });
});

// Define the server port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
