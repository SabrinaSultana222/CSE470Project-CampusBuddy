const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  credits: { type: Number, required: true },
  grade: { type: String },
  gradePoint: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const gpaSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  courses: [courseSchema],
}, { timestamps: true });

module.exports = mongoose.model('Gpa', gpaSchema);
