// server/controllers/adminController.js
const User = require("../models/user");
const ClubPost = require("../models/clubpost");
const clubNotificationService = require("../services/clubNotificationService");

// GET /api/admin/users?role=student|faculty|clubAdmin|admin
const getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const query = role ? { role } : {};

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 });

    return res.json(users);
  } catch (err) {
    console.error("Admin getUsers error:", err.message, err.stack);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/admin/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (err) {
    console.error("Admin getUserById error:", err.message, err.stack);
    return res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/admin/users/:id/status { isActive: boolean }
const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    if (typeof isActive !== "boolean") {
      return res.status(400).json({ message: "isActive must be boolean" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      message: `User ${isActive ? "activated" : "deactivated"} successfully`,
      user,
    });
  } catch (err) {
    console.error("Admin updateUserStatus error:", err.message, err.stack);
    return res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/admin/users/:id/role { isClubAdmin: boolean }
const updateUserRole = async (req, res) => {
  try {
    const { isClubAdmin } = req.body;

    if (typeof isClubAdmin !== "boolean") {
      return res
        .status(400)
        .json({ message: "isClubAdmin must be boolean" });
    }

    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.user && req.user._id.toString() === user._id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot change your own role/flags" });
    }

    if (user.role === "faculty") {
      return res.status(400).json({
        message: "Faculty cannot be assigned club admin privileges here",
      });
    }

    if (user.role !== "student") {
      return res.status(400).json({
        message: "Only students can be promoted to club admin",
      });
    }

    user.isClubAdmin = isClubAdmin;
    await user.save();

    return res.json({
      message: isClubAdmin
        ? "User promoted to student + club admin"
        : "User set back to normal student",
      user,
    });
  } catch (err) {
    console.error("Admin updateUserRole error:", err.message, err.stack);
    return res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user && req.user._id.toString() === id) {
      return res
        .status(400)
        .json({ message: "You cannot delete your own account" });
    }

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Admin deleteUser error:", err.message, err.stack);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/admin/club-posts?status=pending|approved|rejected
const getClubPostsForAdmin = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};

    const posts = await ClubPost.find(query)
      .populate("createdBy", "name email bracuId")
      .sort({ createdAt: -1 });

    return res.json(posts);
  } catch (err) {
    console.error("Admin getClubPostsForAdmin error:", err.message, err.stack);
    return res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/admin/club-posts/:id/status { status: "pending"|"approved"|"rejected" }
const updateClubPostStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = ["pending", "approved", "rejected"];
    if (!allowed.includes(status)) {
      return res
        .status(400)
        .json({ message: "Invalid status value for club post" });
    }

    const post = await ClubPost.findById(req.params.id).populate(
      "createdBy",
      "name email bracuId"
    );
    if (!post) {
      return res.status(404).json({ message: "Club post not found" });
    }

    const prevStatus = post.status;
    post.status = status;
    await post.save();

    // ✅ REALTIME NOTIFICATION TO CLUB ADMIN on APPROVED/REJECTED only
    try {
      // only notify if status actually changes and is approved/rejected
      if (prevStatus !== status && (status === "approved" || status === "rejected")) {
        const adminName = req.user?.name || "Admin";
        const clubAdminId = post.createdBy?._id;

        if (clubAdminId) {
          const notifType =
            status === "approved"
              ? "club_post_approved"
              : "club_post_rejected";

          const msg = `Your club post "${post.title}" was ${status} by ${adminName}.`;
          const link = `/club-posts/my`; // or `/club-posts/${post._id}` if you have detail page

          await clubNotificationService.createAndEmitNotifications(
            notifType,
            post._id,
            req.user._id,
            [clubAdminId],
            msg,
            link
          );
        }
      }
    } catch (notifErr) {
      console.error("Admin -> Club admin notification error:", notifErr);
      // don't fail the main request if notification fails
    }

    return res.json({
      message: `Club post marked as ${status}`,
      post,
    });
  } catch (err) {
    console.error("Admin updateClubPostStatus error:", err.message, err.stack);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
  deleteUser,
  getClubPostsForAdmin,
  updateClubPostStatus,
};
