const mongoose = require('mongoose');

async function migrate() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campus-buddy';
  await mongoose.connect(MONGO_URI);
  console.log('Connected to', MONGO_URI);
  const Course = require('../models/Course');
  const Gpa = require('../models/Gpa');

  const courses = await Course.find().lean();
  const byUser = {};
  courses.forEach(c => {
    const uid = String(c.userId);
    if (!byUser[uid]) byUser[uid] = [];
    byUser[uid].push({ name: c.name, credits: c.credits, grade: c.grade, gradePoint: c.gradePoint });
  });

  for (const uid of Object.keys(byUser)) {
    const existing = await Gpa.findOne({ userId: uid });
    if (existing) {
      existing.courses = existing.courses.concat(byUser[uid]);
      await existing.save();
      console.log('Appended courses for user', uid);
    } else {
      const g = new Gpa({ userId: uid, courses: byUser[uid] });
      await g.save();
      console.log('Created GPA doc for user', uid);
    }
  }

  // optional: remove old Course docs
  // await Course.deleteMany({});

  await mongoose.disconnect();
  console.log('Migration complete');
}

migrate().catch(err => { console.error('Migration failed', err); process.exit(1); });
