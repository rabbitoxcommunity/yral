require('dotenv').config(); // Must be at the very top
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const connectDB = require('./config/database');

// Enhanced with better error handling and validation
const createAdminUser = async () => {
  try {
    console.log('Starting admin user creation...');
    
    // Connect to database
    await connectDB();
    
    const adminUsername = 'admin@yral.com';
    const adminPassword = 'yralconcept#@123';

    // Validate inputs
    if (!adminUsername || !adminPassword) {
      throw new Error('Username and password are required');
    }

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ username: adminUsername });
    
    if (existingAdmin) {
      console.log('ℹ️ Admin user already exists');
      await mongoose.connection.close();
      process.exit(0);
    }

    // Create new admin
    const newAdmin = new Admin({
      username: adminUsername,
      password: adminPassword 
    });

    await newAdmin.save();
    console.log('✅ Admin user created successfully');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  } finally {
    // Ensure connection is closed
    await mongoose.connection.close();
    process.exit(0);
  }
};

// Execute
createAdminUser();