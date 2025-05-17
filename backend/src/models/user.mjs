import mongoose, { model } from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['Admin', 'Operator', 'Manager'],
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// const user = model("User", userSchema);

export default mongoose.models("User", userSchema);
