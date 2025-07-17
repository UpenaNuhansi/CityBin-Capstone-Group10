const mongoose = require('mongoose');
const UserBin = require('../models/UserBin');

mongoose.connect('mongodb://localhost:27017/citybin', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

console.log('Mock IoT: Simulating bin updates...');

setInterval(async () => {
  try {
    const bins = await UserBin.find({});
    for (const bin of bins) {
      const newLevel = Math.floor(Math.random() * 100); // random fill %
      const reward = newLevel > 80 ? 5 : newLevel > 50 ? 3 : 1;

      await UserBin.findByIdAndUpdate(bin._id, {
        fillLevel: newLevel,
        lastUpdated: new Date(),
        $inc: { rewardPoints: reward }
      });

      console.log(`Updated bin ${bin.binId}: ${newLevel}% (+${reward} pts)`);
    }
  } catch (err) {
    console.error('Failed to update bins:', err.message);
  }
}, 30000); // every 30 seconds