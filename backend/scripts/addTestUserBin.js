const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log(" Connected to MongoDB");
}).catch(err => {
  console.error(" MongoDB connection failed:", err.message);
  process.exit(1);
});


const UserBin = require('../models/UserBin'); 


const testUserId = '68403904ae4fba1fe39d63ca';

async function addTestBin() {
  try {
    const bin = new UserBin({
      userId: testUserId,
      binId: 'CB999',
      binType: 'Home Bin',
      location: 'Test Location',
      fillLevel: 72,
      rewardPoints: 25,
    });

    await bin.save();
    console.log(" Test bin added successfully:", bin);
  } catch (err) {
    console.error(" Failed to add test bin:", err.message);
  } finally {
    mongoose.disconnect();
  }
}

addTestBin();