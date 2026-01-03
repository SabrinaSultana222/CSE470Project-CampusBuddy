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
    console.log('🔍 Query params:', req.query);
    
    // Build dynamic query
    const query = { userId: req.user._id };
    
    // Text search on title, course, description
    if (req.query.search) {
      const searchTerm = req.query.search;
      // Use regex search for more flexible matching (works without text index)
      query.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { course: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
      ];
    }
    
    // Filter by status
    if (req.query.status && req.query.status !== 'all' && req.query.status !== '') {
      query.status = req.query.status;
    }
    
    // Filter by course (exact or partial match)
    if (req.query.course) {
      query.course = new RegExp(req.query.course, 'i');
    }
    
    // Filter by due date range
    if (req.query.dueDateFrom || req.query.dueDateTo) {
      query.dueDate = {};
      if (req.query.dueDateFrom) {
        query.dueDate.$gte = new Date(req.query.dueDateFrom);
      }
      if (req.query.dueDateTo) {
        query.dueDate.$lte = new Date(req.query.dueDateTo);
      }
    }
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    
    // Sorting
    let sort = { dueDate: 1 }; // default: upcoming first
    if (req.query.sortBy) {
      console.log('🔀 Received sortBy:', req.query.sortBy);
      switch (req.query.sortBy) {
        case 'date_desc':
          sort = { dueDate: -1 };
          break;
        case 'date_asc':
          sort = { dueDate: 1 };
          break;
        case 'title_asc':
          sort = { title: 1 };
          break;
        case 'title_desc':
          sort = { title: -1 };
          break;
        case 'created_desc':
          sort = { createdAt: -1 };
          break;
        case 'created_asc':
          sort = { createdAt: 1 };
          break;
        default:
          console.log('⚠️ Unknown sortBy value:', req.query.sortBy);
      }
    }
    
    console.log('🔎 Built query:', JSON.stringify(query));
    console.log('📑 Sort:', JSON.stringify(sort), 'Page:', page, 'Limit:', limit);
    
    // Execute query with pagination
    const data = await Assignment.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);
      
    // Get total count for pagination
    const total = await Assignment.countDocuments(query);
    
    console.log('📊 Found', data.length, 'assignments (', total, 'total)');
    
    res.json({
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
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
    console.log('📤 Resubmit request for assignment:', req.params.id);
    console.log('👤 User:', req.user._id);
    console.log('📎 File:', req.file ? req.file.filename : 'NO FILE');
    
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
    assignment.status = 'submitted'; // Update status to submitted when file is uploaded
    assignment.updatedAt = new Date();
    await assignment.save();

    console.log('✅ File attached successfully:', fileMeta.filename);
    console.log('📊 Total attachments:', assignment.attachments.length);

    res.json({ success: true, attachment: fileMeta, assignment });
  } catch (err) {
    console.error('❌ Error in resubmit:', err.message);
    res.status(500).json({ error: err.message });
  }
};
