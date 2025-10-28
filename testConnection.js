require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');
console.log('Connection string:', process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@'));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ SUCCESS! Connected to MongoDB Atlas!');
    mongoose.connection.close();
    process.exit(0);
  })
  .catch((error) => {
    console.log('❌ Connection failed:');
    console.log('Error name:', error.name);
    console.log('Error message:', error.message);
    console.log('\nFull error:', error);
    process.exit(1);
  });
