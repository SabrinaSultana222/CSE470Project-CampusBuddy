// server/routes/adminRoutes.js
const express = require("express");
const {
  getUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
  deleteUser,
  getClubPostsForAdmin,     // NEW
  updateClubPostStatus,     // NEW
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// all admin routes: must be logged in AND role === "admin"
router.use(protect, adminOnly);

router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.patch("/users/:id/status", updateUserStatus);
router.patch("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

// NEW: club posts moderation
// GET /api/admin/club-posts?status=pending
router.get("/club-posts", getClubPostsForAdmin);

// PATCH /api/admin/club-posts/:id/status
router.patch("/club-posts/:id/status", updateClubPostStatus);

module.exports = router;
