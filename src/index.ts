import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import './config/passport'; // Initialize Passport configuration
import connectDB from './config/dbConfig'; // Import the database configuration
import authRoutes from './routes/authRoutes';
import roleRoutes from './routes/roleRoutes';
import serviceRoutes from './routes/serviceRoutes';
import carTypeRoutes from './routes/carTypeRoutes';
import brandRoutes from './routes/brandRoutes';
import newsRoutes from './routes/newsRoutes';
import { PORT } from './config/global';


const app = express();
const port = PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use('/uploads', express.static('uploads')); // Serve static files from the uploads directory

app.get('/', (req, res) => {
  res.send('Server is available');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/role', roleRoutes);
app.use('/api/service', serviceRoutes);
app.use('/api/car', carTypeRoutes);
app.use('/api/brand', brandRoutes);
app.use('/api/news', newsRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});