const express = require('express');
const router = express.Router();
const profileCtrl = require('../controllers/profileController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'uploads', 'avatars');
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

router.get('/', auth, profileCtrl.getProfile);

// Upload avatar with error handling
router.post('/avatar', auth, (req, res, next) => {
  upload.single('avatar')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Multer-specific errors
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size too large. Maximum 5MB allowed.' });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // Other errors (e.g., file type validation)
      return res.status(400).json({ error: err.message });
    }
    // No error, proceed to controller
    next();
  });
}, profileCtrl.uploadAvatar);

router.put(
	'/',
	auth,
	[body('name').optional().notEmpty().withMessage('Name cannot be empty'), body('email').optional().isEmail().withMessage('Email must be valid')],
	validate,
	profileCtrl.updateProfile
);

router.put(
	'/password',
	auth,
	[
		body('currentPassword').notEmpty().withMessage('Current password is required'),
		body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
	],
	validate,
	profileCtrl.changePassword
);

module.exports = router;
