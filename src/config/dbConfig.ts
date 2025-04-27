import mongoose from 'mongoose';
import { MONGO_URI } from './global';

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = MONGO_URI || 'mongodb://localhost:27017/mydatabase'; // Replace with your MongoDB URI
    await mongoose.connect(mongoURI); // No need for additional options
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;