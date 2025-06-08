require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const adminExists = await User.findOne({ role: 'Admin' });
    if (adminExists) {
      console.log(' Admin already exists');
      return;
    }

    const admin = new User({
      username: 'Admin',
      email: 'admin@citybin.com',
      password: 'Admin1234', // plain password - will be hashed in pre('save')
      role: 'Admin'
    });

    await admin.save(); //  this will now auto-hash + assign uniqueId via Counter

    console.log(' Admin seeded successfully!');
  } catch (err) {
    console.error(' Error seeding admin:', err);
  } finally {
    await mongoose.connection.close();
  }
};

seedAdmin();
