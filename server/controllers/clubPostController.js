// server/controllers/clubPostController.js
const ClubPost = require("../models/clubpost");
const User = require("../models/user");
const clubNotificationService = require("../services/clubNotificationService");

// POST /api/club-posts  (club admin creates a post)
const createClubPost = async (req, res) => {
  try {
    const { title, description, clubName, eventDate, location, category } =
      req.body;

    // must be logged in and flagged as club admin
    if (!req.user || req.user.role !== "student" || !req.user.isClubAdmin) {
      return res
        .status(403)
        .json({ message: "Only student club admins can create posts" });
    }

    if (!title || !description || !clubName) {
      return res
        .status(400)
        .json({ message: "Title, description and club name are required" });
    }

    const post = await ClubPost.create({
      createdBy: req.user._id,
      clubName,
      title,
      description,
      eventDate: eventDate ? new Date(eventDate) : undefined,
      location,
      category,
      status: "pending", // admin can approve later
    });

    // ✅ REALTIME NOTIFICATION TO ADMINS (pending approval)
    try {
      const senderName = req.user?.name || "A club admin";

      // all admins
      const admins = await User.find({ role: "admin" }).select("_id");
      const adminIds = admins.map((a) => a._id);

      const msg = `${senderName} submitted a ${category || "club"} post for approval: "${title}"`;
      const link = `/admin/club-posts`; // or `/admin/club-posts/${post._id}` if you have that page

      if (adminIds.length > 0) {
        await clubNotificationService.createAndEmitNotifications(
          "club_post_submitted",
          post._id,
          req.user._id,
          adminIds,
          msg,
          link
        );
      }
    } catch (notifErr) {
      console.error("Club admin -> Admin notification error:", notifErr);
      // don't fail the main request if notification fails
    }

    return res.status(201).json(post);
  } catch (err) {
    console.error("createClubPost error:", err.message, err.stack);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/club-posts/my  (club admin sees own posts)
const getMyClubPosts = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "student" || !req.user.isClubAdmin) {
      return res
        .status(403)
        .json({ message: "Only student club admins can view their posts" });
    }

    const posts = await ClubPost.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    return res.json(posts);
  } catch (err) {
    console.error("getMyClubPosts error:", err.message, err.stack);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/club-posts  (students see approved posts with search/filter)
const getApprovedClubPosts = async (req, res) => {
  try {
    console.log('🔍 Club Posts - Query params:', req.query);
    
    const { search, category, clubName, sortBy } = req.query;
    const filter = { status: "approved" };
    
    // Text search on title, description, clubName
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { clubName: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by category
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    // Filter by club name
    if (clubName) {
      filter.clubName = { $regex: clubName, $options: 'i' };
    }
    
    // Date range filter for event date
    if (req.query.eventDateFrom || req.query.eventDateTo) {
      filter.eventDate = {};
      if (req.query.eventDateFrom) {
        filter.eventDate.$gte = new Date(req.query.eventDateFrom);
      }
      if (req.query.eventDateTo) {
        filter.eventDate.$lte = new Date(req.query.eventDateTo);
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
          sort = { eventDate: -1 };
          break;
        case 'date_asc':
          sort = { eventDate: 1 };
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
    
    const posts = await ClubPost.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Get total count
    const total = await ClubPost.countDocuments(filter);
    
    console.log('✅ Found', posts.length, 'club posts (', total, 'total)');
    
    return res.json({
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error("getApprovedClubPosts error:", err.message, err.stack);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createClubPost,
  getMyClubPosts,
  getApprovedClubPosts,
};
