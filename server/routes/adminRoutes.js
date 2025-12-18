// server/routes/adminRoutes.js
const express = require("express");
const {
  getUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
  deleteUser,
  getClubPostsForAdmin,
  updateClubPostStatus,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// all admin routes: must be logged in AND role === "admin"
router.use(protect, adminOnly);

// user management
router.get("/users", getUsers);               // /api/admin/users?role=student
router.get("/users/:id", getUserById);
router.patch("/users/:id/status", updateUserStatus);
router.patch("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

// club posts moderation
router.get("/club-posts", getClubPostsForAdmin);
router.patch("/club-posts/:id/status", updateClubPostStatus);

module.exports = router;
