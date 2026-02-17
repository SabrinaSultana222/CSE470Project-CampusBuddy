const mongoose = require('mongoose');

const lostFoundSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['lost', 'found'], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['id', 'electronics', 'books', 'keys', 'wallet', 'clothing', 'others'], 
    required: true 
  },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  imageUrl: String,
  contactMethod: { type: String, enum: ['chat', 'email', 'phone'], default: 'email' },
  contactInfo: String,
  status: { type: String, enum: ['open', 'resolved'], default: 'open' },
}, { timestamps: true });

// Index for faster queries
lostFoundSchema.index({ type: 1, status: 1, createdAt: -1 });
lostFoundSchema.index({ userId: 1 });
lostFoundSchema.index({ category: 1 });
lostFoundSchema.index({ date: -1 });
lostFoundSchema.index({ title: 'text', description: 'text', location: 'text' });

module.exports = mongoose.model('LostFound', lostFoundSchema);
