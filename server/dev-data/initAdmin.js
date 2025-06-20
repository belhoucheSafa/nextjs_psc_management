const mongoose = require('mongoose');
const User = require('../models/userModel');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const DB = process.env.MONGODB_URI;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));

// Admin credentials
const adminUser = {
  name: 'Admin',
  email: 'admin@psc.tn',
  password: 'Admin@123',
  passwordConfirm: 'Admin@123',
  role: 'super-admin'
};

// Create admin user
const createAdmin = async () => {
  try {
    await User.create(adminUser);
    console.log('Admin user created successfully!');
    console.log('Email:', adminUser.email);
    console.log('Password:', adminUser.password);
    process.exit();
  } catch (err) {
    console.log('Error creating admin user:', err);
    process.exit(1);
  }
};

createAdmin(); 