// server/routes/clubPostRoutes.js
const express = require("express");
const {
  createClubPost,
  getMyClubPosts,
  getApprovedClubPosts,
} = require("../controllers/clubPostController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// must be logged in for all these
router.use(protect);

// students & others: list approved posts
router.get("/", getApprovedClubPosts);

// club admin: own posts
router.get("/my", getMyClubPosts);

// club admin: create
router.post("/", createClubPost);

module.exports = router;
