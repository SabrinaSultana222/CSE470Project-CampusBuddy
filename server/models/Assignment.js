const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  course: { type: String, required: true },
  dueDate: { type: Date, required: true },
  description: String,
  completed: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  attachments: [
    {
      filename: String,
      originalName: String,
      mimetype: String,
      size: Number,
      url: String,
      uploadedAt: { type: Date, default: Date.now },
    }
  ],
  status: { type: String, enum: ['pending', 'submitted', 'graded'], default: 'pending' },
}, { timestamps: true });

// Create indexes for better search performance
assignmentSchema.index({ title: 'text', course: 'text', description: 'text' });
assignmentSchema.index({ userId: 1, dueDate: -1 });
assignmentSchema.index({ userId: 1, status: 1 });
assignmentSchema.index({ userId: 1, course: 1 });

module.exports = mongoose.model("Assignment", assignmentSchema);