import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import jobRoutes from './routes/jobRoutes.js';
import authRoutes from './routes/authRoutes.js';
import roadmapRoutes from './routes/roadmapRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/test';

// Debug: Log environment variables
console.log('Environment variables:');
console.log('MONGO_URI:', MONGO_URI);
console.log('PORT:', PORT);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/job', jobRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/roadmap', roadmapRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Jobs API is running' });
});

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('Connection string:', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
};

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
