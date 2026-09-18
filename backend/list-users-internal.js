require('dotenv').config();
const User = require('./src/models/User');

async function listUsers() {
  try {
    const users = await User.find({}, 'email role approved');
    console.log('Registered Users in PostgreSQL:');
    users.forEach(user => {
      console.log(`- ${user.email} (Role: ${user.role}, Approved: ${user.approved})`);
    });
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

listUsers();
