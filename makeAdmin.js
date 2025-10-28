require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./server/models/User');

// ⚠️ IMPORTANT: Replace this with the email you used to register
const EMAIL_TO_MAKE_ADMIN = 'CHANGE_THIS_TO_YOUR_EMAIL@example.com';

async function makeAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const user = await User.findOne({ email: EMAIL_TO_MAKE_ADMIN });
    
    if (!user) {
      console.log('❌ User not found with email:', EMAIL_TO_MAKE_ADMIN);
      console.log('Please update the EMAIL_TO_MAKE_ADMIN variable in this script');
      process.exit(1);
    }

    user.isAdmin = true;
    await user.save();

    console.log('✅ SUCCESS! User is now an admin:');
    console.log('   Email:', user.email);
    console.log('   Username:', user.username);
    console.log('   Admin:', user.isAdmin);
    
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

makeAdmin();
