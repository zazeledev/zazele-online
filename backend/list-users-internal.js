require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

async function listUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const users = await User.find({}, 'email role approved');
    console.log('Registered Users:');
    users.forEach(user => {
      console.log(`- ${user.email} (Role: ${user.role}, Approved: ${user.approved})`);
    });
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

listUsers();
