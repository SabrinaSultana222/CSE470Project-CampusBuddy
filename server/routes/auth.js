const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

router.post(
	'/register',
	[
		body('name').notEmpty().withMessage('Name is required'),
		body('email').isEmail().withMessage('Valid email is required'),
		body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
	],
	validate,
	authCtrl.register
);

router.post(
	'/login',
	[
		body('email').isEmail().withMessage('Valid email is required'),
		body('password').notEmpty().withMessage('Password is required'),
	],
	validate,
	authCtrl.login
);

// Rate limit auth endpoints to mitigate brute-force
const rateLimit = require('express-rate-limit');
const authLimiter = rateLimit({ windowMs: 60 * 1000, max: 10 });
router.use('/login', authLimiter);
router.use('/register', authLimiter);
router.get('/me', auth, authCtrl.me);

module.exports = router;
