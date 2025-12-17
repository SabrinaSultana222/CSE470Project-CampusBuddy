const Assignment = require('../models/Assignment');
const path = require('path');
const fs = require('fs');

exports.addAssignment = async (req, res) => {
  try {
    console.log('📝 Adding assignment:', req.body);
    console.log('👤 User:', req.user ? req.user._id : 'NO USER');
    const assignment = new Assignment({ ...req.body, userId: req.user._id });
    await assignment.save();
    console.log('✅ Assignment saved:', assignment._id);
    res.json({ success: true, assignment });
  } catch (err) {
    console.error('❌ Error saving assignment:', err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getAssignments = async (req, res) => {
  try {
    console.log('📋 Fetching assignments for user:', req.user ? req.user._id : 'NO USER');
    const data = await Assignment.find({ userId: req.user._id });
    console.log('📊 Found', data.length, 'assignments');
    res.json(data);
  } catch (err) {
    console.error('❌ Error fetching assignments:', err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Not found' });
    if (assignment.userId.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Unauthorized' });
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Not found' });
    if (assignment.userId.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Unauthorized' });
    await Assignment.findByIdAndUpdate(req.params.id, req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Not found' });
    if (assignment.userId.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Unauthorized' });
    // remove any attached files from disk
    if (assignment.attachments && assignment.attachments.length > 0) {
      assignment.attachments.forEach((att) => {
        try {
          const p = path.join(__dirname, '..', 'uploads', att.filename);
          if (fs.existsSync(p)) fs.unlinkSync(p);
        } catch (err) {
          console.warn('Failed to remove attachment', att && att.filename, err && err.message);
        }
      });
    }
    await Assignment.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.resubmit = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Not found' });
    if (assignment.userId.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Unauthorized' });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const fileMeta = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: `/uploads/${req.file.filename}`,
      uploadedAt: new Date(),
    };

    assignment.attachments = assignment.attachments || [];
    assignment.attachments.push(fileMeta);
    assignment.updatedAt = new Date();
    await assignment.save();

    res.json({ success: true, attachment: fileMeta, assignment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
