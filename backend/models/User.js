const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Counter = require('./Counter');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true
   },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: {
     type: String, 
     required: true
 },
  role: { 
    type: String, 
    enum: ['User', 'Admin', 'Operator'],
    default: 'User' 
  },
  uniqueId: { 
    type: String, 
    unique: true // e.g., CBU001, CBU002
  }, 
  status: { 
    type: String, 
    enum: ['Active', 'Inactive'], 
    default: 'Active' 
  },
  lastLogin: { 
    type: Date 
  },
  avatar: { 
    type: String, 
    default: '' 
  }

});

// Auto hash password and generate unified uniqueId
userSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
    }

    // Generate uniqueId only for new users
    if (this.isNew && !this.uniqueId) {
      const prefix = 'CBU'; // Shared prefix for all roles

      const counter = await Counter.findOneAndUpdate(
        { name: 'user' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );

      const formattedNumber = String(counter.seq).padStart(3, '0');
      this.uniqueId = `${prefix}${formattedNumber}`;
    }

    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
