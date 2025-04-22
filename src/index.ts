import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import authRoutes from './routes/authRoutes';
import './config/passport'; // Initialize Passport configuration
import connectDB from './config/dbConfig'; // Import the database configuration

import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());

app.get('/', (req, res) => {
  res.send('Server is available');
});

// Routes
app.use('/api/auth', authRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});