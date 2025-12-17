const express = require('express');
const router = express.Router();
const profileCtrl = require('../controllers/profileController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

// Mirror of /api/profile endpoints under /api/users/profile
router.get('/profile', auth, profileCtrl.getProfile);

router.put(
  '/profile',
  auth,
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Email must be valid'),
  ],
  validate,
  profileCtrl.updateProfile
);

module.exports = router;
