const express = require('express');
const router = express.Router();
const lostFoundCtrl = require('../controllers/lostFoundController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'uploads', 'lostfound');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Public routes
router.get('/', lostFoundCtrl.getAllPosts);
router.get('/:id', lostFoundCtrl.getPostById);
router.get('/:postId/suggestions', lostFoundCtrl.getMatchingSuggestions);

// Protected routes (require authentication)
router.post('/', auth, upload.single('image'), lostFoundCtrl.createPost);
router.put('/:id', auth, upload.single('image'), lostFoundCtrl.updatePost);
router.delete('/:id', auth, lostFoundCtrl.deletePost);
router.patch('/:id/resolve', auth, lostFoundCtrl.resolvePost);

module.exports = router;
