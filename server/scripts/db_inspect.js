const mongoose = require('mongoose');

async function main() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campus-buddy';
  await mongoose.connect(MONGO_URI);
  console.log('Connected to', MONGO_URI);
  const User = require('../models/User');
  const Assignment = require('../models/Assignment');

  const users = await User.find().select('_id name email').lean();
  console.log('\nUSERS:\n', JSON.stringify(users, null, 2));

  // assignments with attachments
  const withAttachments = await Assignment.find({ 'attachments.0': { $exists: true } }).select('_id title course userId attachments').lean();
  console.log('\nASSIGNMENTS WITH ATTACHMENTS:\n', JSON.stringify(withAttachments, null, 2));

  // counts by user
  const counts = await Assignment.aggregate([{ $group: { _id: '$userId', count: { $sum: 1 } } }]);
  console.log('\nASSIGNMENT COUNTS BY USER:\n', JSON.stringify(counts, null, 2));

  // list files on disk and check for orphans
  const path = require('path');
  const fs = require('fs');
  const uploadDir = path.join(__dirname, '..', 'uploads');
  const diskFiles = fs.existsSync(uploadDir) ? fs.readdirSync(uploadDir) : [];
  console.log('\nFILES ON DISK:', diskFiles);

  const allAssignments = await Assignment.find().select('attachments').lean();
  const referenced = new Set();
  allAssignments.forEach(a => {
    (a.attachments || []).forEach(att => { if (att && att.filename) referenced.add(att.filename); });
  });
  const orphans = diskFiles.filter(f => !referenced.has(f));
  console.log('\nORPHANED FILES (on disk but not referenced by any assignment):', orphans);

  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Error:', err && err.message ? err.message : err);
  process.exit(1);
});
