const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  userId: String,
  title: String,
  date: String,
}, { timestamps: true });

// Add indexes for better search performance
EventSchema.index({ title: 'text' });
EventSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model("Event", EventSchema);
