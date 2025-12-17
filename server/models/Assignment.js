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
}, { timestamps: true });

module.exports = mongoose.model("Assignment", assignmentSchema);