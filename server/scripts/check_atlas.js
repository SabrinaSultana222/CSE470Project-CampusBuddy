const mongoose = require('mongoose');
require('dotenv').config();

const Assignment = require('../models/Assignment');
const User = require('../models/user');

async function checkAtlas() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    console.log('URI:', process.env.MONGO_URI.replace(/:[^:]*@/, ':****@'));
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas\n');

    // Check users
    const users = await User.find({}, 'name email role').limit(10);
    console.log(`📊 Users (${users.length}):`);
    users.forEach(u => console.log(`  - ${u.name} (${u.email}) - ${u.role}`));
    
    // Check assignments
    const assignments = await Assignment.find({}).populate('userId', 'name email');
    console.log(`\n📝 Assignments (${assignments.length}):`);
    assignments.forEach(a => {
      const userName = a.userId ? a.userId.name : 'Unknown User';
      console.log(`  - ${a.title} (${a.course}) - Due: ${a.dueDate.toISOString().split('T')[0]} - By: ${userName}`);
    });

    if (assignments.length === 0) {
      console.log('  ⚠️  No assignments found in MongoDB Atlas database!');
      console.log('  💡 This means assignments are being saved to local MongoDB instead.');
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

checkAtlas();
