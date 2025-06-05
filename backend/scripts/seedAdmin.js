const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected!');
    
    await User.deleteMany({ role: 'Admin' });
    await User.create({
      username: 'admin',
      email: 'admin@citybin.com',
      password: 'Admin123', // Hashed by bcrypt
      role: 'Admin',
      status: 'Active'
    });

    console.log('Admin user created!');
    mongoose.connection.close();
  })
  .catch(err => console.error('DB error:', err));