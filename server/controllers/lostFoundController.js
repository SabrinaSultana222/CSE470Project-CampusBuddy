const LostFound = require('../models/LostFound');
const User = require('../models/User');

// Get all lost & found posts with filters
exports.getAllPosts = async (req, res) => {
  try {
    console.log('🔍 Lost & Found - Query params:', req.query);
    
    const { type, category, status, search, location, sortBy } = req.query;
    const filter = {};
    
    // Filter by type (lost/found)
    if (type && type !== 'all') filter.type = type;
    
    // Filter by category
    if (category && category !== 'all') filter.category = category;
    
    // Filter by status
    if (status && status !== 'all') filter.status = status;
    else filter.status = 'open'; // Default to open posts
    
    // Text search on title, description, location
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by location
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    
    // Date range filter
    if (req.query.dateFrom || req.query.dateTo) {
      filter.date = {};
      if (req.query.dateFrom) {
        filter.date.$gte = new Date(req.query.dateFrom);
      }
      if (req.query.dateTo) {
        filter.date.$lte = new Date(req.query.dateTo);
      }
    }
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    
    // Sorting
    let sort = { createdAt: -1 }; // default: newest first
    if (sortBy) {
      switch (sortBy) {
        case 'date_desc':
          sort = { date: -1 };
          break;
        case 'date_asc':
          sort = { date: 1 };
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
      }
    }
    
    console.log('🔎 Built filter:', JSON.stringify(filter));
    console.log('📊 Sort:', sort, 'Page:', page, 'Limit:', limit);
    
    const posts = await LostFound.find(filter)
      .populate('userId', 'name email studentId avatarUrl')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    // Get total count
    const total = await LostFound.countDocuments(filter);
    
    console.log('✅ Found', posts.length, 'posts (', total, 'total)');
    
    res.json({
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('❌ Error fetching lost & found posts:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get single post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await LostFound.findById(req.params.id)
      .populate('userId', 'name email studentId avatarUrl');
    
    if (!post) return res.status(404).json({ error: 'Post not found' });
    
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { type, title, description, category, location, date, contactMethod, contactInfo } = req.body;
    
    // Validation
    if (!type || !title || !description || !category || !location || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const post = new LostFound({
      userId: req.user._id,
      type,
      title,
      description,
      category,
      location,
      date,
      contactMethod: contactMethod || 'email',
      contactInfo,
      imageUrl: req.file ? `/uploads/lostfound/${req.file.filename}` : null,
    });
    
    await post.save();
    const populated = await LostFound.findById(post._id)
      .populate('userId', 'name email studentId avatarUrl');
    
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a post (only owner)
exports.updatePost = async (req, res) => {
  try {
    const post = await LostFound.findById(req.params.id);
    
    if (!post) return res.status(404).json({ error: 'Post not found' });
    
    // Check ownership
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this post' });
    }
    
    const { title, description, category, location, date, contactMethod, contactInfo, status } = req.body;
    
    if (title) post.title = title;
    if (description) post.description = description;
    if (category) post.category = category;
    if (location) post.location = location;
    if (date) post.date = date;
    if (contactMethod) post.contactMethod = contactMethod;
    if (contactInfo !== undefined) post.contactInfo = contactInfo;
    if (status) post.status = status;
    if (req.file) post.imageUrl = `/uploads/lostfound/${req.file.filename}`;
    
    await post.save();
    const updated = await LostFound.findById(post._id)
      .populate('userId', 'name email studentId avatarUrl');
    
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a post (only owner)
exports.deletePost = async (req, res) => {
  try {
    const post = await LostFound.findById(req.params.id);
    
    if (!post) return res.status(404).json({ error: 'Post not found' });
    
    // Check ownership
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }
    
    await LostFound.findByIdAndDelete(req.params.id);
    
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark post as resolved
exports.resolvePost = async (req, res) => {
  try {
    const post = await LostFound.findById(req.params.id);
    
    if (!post) return res.status(404).json({ error: 'Post not found' });
    
    // Check ownership
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to resolve this post' });
    }
    
    post.status = 'resolved';
    await post.save();
    
    const updated = await LostFound.findById(post._id)
      .populate('userId', 'name email studentId avatarUrl');
    
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get matching suggestions (bonus feature)
exports.getMatchingSuggestions = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await LostFound.findById(postId);
    
    if (!post) return res.status(404).json({ error: 'Post not found' });
    
    // Find opposite type with similar title/category
    const oppositeType = post.type === 'lost' ? 'found' : 'lost';
    
    const suggestions = await LostFound.find({
      type: oppositeType,
      status: 'open',
      $or: [
        { category: post.category },
        { title: { $regex: post.title.split(' ')[0], $options: 'i' } }
      ],
      _id: { $ne: postId }
    })
    .populate('userId', 'name email studentId')
    .limit(5);
    
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
