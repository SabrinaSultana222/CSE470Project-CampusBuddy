// server/controllers/clubPostController.js
const ClubPost = require("../models/clubpost");
const User = require("../models/user");

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

// GET /api/club-posts  (students see approved posts)
const getApprovedClubPosts = async (req, res) => {
  try {
    const posts = await ClubPost.find({ status: "approved" })
      .sort({ createdAt: -1 })
      .lean();

    return res.json(posts);
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
