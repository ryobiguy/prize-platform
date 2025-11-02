const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const makeAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // Find user by email and make them admin
    const email = 'ryanryobi@gmail.com';
    const user = await User.findOne({ email });

    if (!user) {
      console.log('❌ User not found:', email);
      process.exit(1);
    }

    user.isAdmin = true;
    await user.save();

    console.log('✅ User is now an admin:', email);
    console.log('Username:', user.username);
    console.log('Email:', user.email);
    console.log('Admin:', user.isAdmin);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

makeAdmin();
