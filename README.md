# Task Management Backend

This is a Task Management Backend using Express.js, MongoDB, and JWT for user authentication. The application allows users to register, log in, create tasks, and retrieve tasks. It includes input validation using **express-validator** and JWT authentication to secure routes.

## Technologies Used

- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Web framework for Node.js.
- **MongoDB**: NoSQL database for storing user and task data.
- **Mongoose**: MongoDB object modeling tool for Node.js.
- **JWT (JSON Web Token)**: For secure user authentication.
- **express-validator**: For request data validation.

## Prerequisites

- **Node.js** and **npm** installed.
- **MongoDB** installed and running.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd project-folder
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root of your project and add:
   ```bash
   JWT_SECRET= your JWT_SECRET
   MONGODB_URI=your-mongodb-uri
   ```

4. Start the server:
   ```bash
   npm start
   ```

## License

This project is licensed under the MIT License.

