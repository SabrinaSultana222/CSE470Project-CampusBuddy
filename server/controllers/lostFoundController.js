const LostFound = require('../models/LostFound');
const User = require('../models/User');

// Get all lost & found posts with filters
exports.getAllPosts = async (req, res) => {
  try {
    const { type, category, status, search } = req.query;
    const filter = {};
    
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (status) filter.status = status;
    else filter.status = 'open'; // Default to open posts
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const posts = await LostFound.find(filter)
      .populate('userId', 'name email studentId avatarUrl')
      .sort({ createdAt: -1 });
    
    res.json(posts);
  } catch (err) {
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
