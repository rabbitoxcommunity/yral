const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const connectDB = require('./config/database');

const createAdminUser = async () => {
  try {
    await connectDB();

    const adminUsername = 'admin@birthstory.co';
    const adminPassword = 'birthstory#@!';

    const existingAdmin = await Admin.findOne({ username: adminUsername });

    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const newAdmin = new Admin({
      username: adminUsername,
      password: adminPassword,
    });

    await newAdmin.save();

    console.log('Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser();