const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const discussionController = require("../controllers/discussionController");

// all routes require login
router.post("/discussions", auth, discussionController.createPost);
router.get("/discussions", auth, discussionController.getPosts);
router.get("/discussions/:id", auth, discussionController.getPostWithComments);
router.post(
  "/discussions/:id/comments",
  auth,
  discussionController.addComment
);

module.exports = router;
