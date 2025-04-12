require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Debug log to verify connection string
    console.log('Attempting to connect to MongoDB with URL:', process.env.MONGO_URL);

    if (!process.env.MONGO_URL) {
      throw new Error('MongoDB connection string is missing in .env file');
    }

    // Modern connection without deprecated options
    await mongoose.connect(process.env.MONGO_URL);
    
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Optional: Add event listeners for better debugging
mongoose.connection.on('connecting', () => {
  console.log('Connecting to MongoDB...');
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

module.exports = connectDB;