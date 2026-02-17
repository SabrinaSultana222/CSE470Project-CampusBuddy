const Gpa = require('../models/Gpa');

function calculateGPA(courses) {
  let totalCredits = 0;
  let totalPoints = 0;
  for (const c of courses) {
    const credit = Number(c.credits) || 0;
    const gp = Number(c.gradePoint) || 0;
    if (credit > 0) {
      totalCredits += credit;
      totalPoints += credit * gp;
    }
  }
  const gpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0;
  return { gpa: Math.round(gpa * 100) / 100, totalCredits, totalPoints };
}

// helper to get or create gpa doc for user
async function getOrCreateGpa(userId) {
  let g = await Gpa.findOne({ userId });
  if (!g) {
    g = new Gpa({ userId, courses: [] });
    await g.save();
  }
  return g;
}

exports.addCourse = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, credits, grade, gradePoint } = req.body;
    console.log('📚 Adding GPA course for user:', userId);
    console.log('📖 Course data:', { name, credits, grade, gradePoint });
    
    // server-side validation
    if (!name || !name.trim()) return res.status(400).json({ error: 'Course name is required' });
    const creditNum = Number(credits);
    if (!creditNum || creditNum <= 0) return res.status(400).json({ error: 'Credits must be greater than 0' });
    const gpNum = Number(gradePoint);
    if (isNaN(gpNum) || gpNum < 0 || gpNum > 4) return res.status(400).json({ error: 'Grade point must be between 0 and 4' });

    const g = await getOrCreateGpa(userId);
    const sub = { name: name.trim(), credits: creditNum, grade: grade || '', gradePoint: gpNum };
    g.courses.push(sub);
    await g.save();
    console.log('✅ Course saved successfully. Total courses:', g.courses.length);
    res.json({ success: true, course: g.courses[g.courses.length - 1], stats: calculateGPA(g.courses) });
  } catch (err) {
    console.error('❌ Error adding course:', err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log('📋 Fetching GPA courses for user:', userId);
    const g = await Gpa.findOne({ userId });
    const courses = g ? g.courses : [];
    console.log('📊 Found', courses.length, 'courses');
    res.json({ courses, stats: calculateGPA(courses) });
  } catch (err) {
    console.error('❌ Error fetching courses:', err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user._id;
    const g = await Gpa.findOne({ userId });
    if (!g) return res.status(404).json({ error: 'No courses found for user' });
    const sub = g.courses.id(courseId);
    if (!sub) return res.status(404).json({ error: 'Course not found' });
    // apply updates with validation
    if (req.body.name !== undefined) {
      if (!req.body.name || !req.body.name.trim()) return res.status(400).json({ error: 'Course name cannot be empty' });
      sub.name = req.body.name.trim();
    }
    if (req.body.credits !== undefined) {
      const creditNum = Number(req.body.credits);
      if (!creditNum || creditNum <= 0) return res.status(400).json({ error: 'Credits must be greater than 0' });
      sub.credits = creditNum;
    }
    if (req.body.gradePoint !== undefined) {
      const gpNum = Number(req.body.gradePoint);
      if (isNaN(gpNum) || gpNum < 0 || gpNum > 4) return res.status(400).json({ error: 'Grade point must be between 0 and 4' });
      sub.gradePoint = gpNum;
    }
    if (req.body.grade !== undefined) sub.grade = req.body.grade;
    await g.save();
    res.json({ success: true, stats: calculateGPA(g.courses) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user._id;
    const g = await Gpa.findOne({ userId });
    if (!g) return res.status(404).json({ error: 'No courses found for user' });
    g.courses.id(courseId).remove();
    await g.save();
    res.json({ success: true, stats: calculateGPA(g.courses) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.calculateFromPayload = async (req, res) => {
  try {
    const { courses } = req.body;
    if (!Array.isArray(courses) || courses.length === 0) return res.status(400).json({ error: 'Courses array is required' });
    // validate each
    for (const c of courses) {
      if (!c.name || !c.name.trim()) return res.status(400).json({ error: 'Each course must have a name' });
      const creditNum = Number(c.credits);
      if (!creditNum || creditNum <= 0) return res.status(400).json({ error: 'Each course must have credits > 0' });
      const gpNum = Number(c.gradePoint);
      if (isNaN(gpNum) || gpNum < 0 || gpNum > 4) return res.status(400).json({ error: 'Invalid grade point in one of the courses' });
    }
    const stats = calculateGPA(courses);
    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.saveAllCourses = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courses } = req.body;
    console.log('💾 Saving all courses for user:', userId);
    console.log('📝 Number of courses to save:', courses ? courses.length : 0);
    
    if (!Array.isArray(courses)) return res.status(400).json({ error: 'Courses array is required' });
    
    // Validate all courses
    for (const c of courses) {
      if (!c.name || !c.name.trim()) return res.status(400).json({ error: 'Each course must have a name' });
      const creditNum = Number(c.credits);
      if (!creditNum || creditNum <= 0) return res.status(400).json({ error: 'Each course must have credits > 0' });
      const gpNum = Number(c.gradePoint);
      if (isNaN(gpNum) || gpNum < 0 || gpNum > 4) return res.status(400).json({ error: 'Invalid grade point' });
    }
    
    // Get or create GPA document
    let g = await Gpa.findOne({ userId });
    if (!g) {
      g = new Gpa({ userId, courses: [] });
    }
    
    // Replace all courses with new ones
    g.courses = courses.map(c => ({
      name: c.name.trim(),
      credits: Number(c.credits),
      grade: c.grade || '',
      gradePoint: Number(c.gradePoint)
    }));
    
    await g.save();
    console.log('✅ All courses saved successfully. Total:', g.courses.length);
    
    res.json({ success: true, courses: g.courses, stats: calculateGPA(g.courses) });
  } catch (err) {
    console.error('❌ Error saving courses:', err.message);
    res.status(500).json({ error: err.message });
  }
};
