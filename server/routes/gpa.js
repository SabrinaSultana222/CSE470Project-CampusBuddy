const express = require('express');
const router = express.Router();
const gpaCtrl = require('../controllers/gpaController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

// Protected routes: require Authorization Bearer token
router.post(
	'/course',
	auth,
	[
		body('name').notEmpty().withMessage('Course name is required'),
		body('grade').notEmpty().withMessage('Grade is required'),
		body('credits').isFloat({ gt: 0 }).withMessage('Credits must be a number greater than 0'),
		body('gradePoint').isFloat({ min: 0, max: 4 }).withMessage('Grade point must be between 0 and 4'),
	],
	validate,
	gpaCtrl.addCourse
);

router.get('/courses', auth, gpaCtrl.getCourses);

router.post('/courses/save-all', auth, gpaCtrl.saveAllCourses);

router.post('/calculate', auth, gpaCtrl.calculateFromPayload);

router.put(
	'/course/:id',
	auth,
	[body('name').optional().notEmpty().withMessage('Course name cannot be empty'), body('credits').optional().isFloat({ gt: 0 }).withMessage('Credits must be a number greater than 0'), body('gradePoint').optional().isFloat({ min: 0, max: 4 }).withMessage('Grade point must be between 0 and 4')],
	validate,
	gpaCtrl.updateCourse
);

router.delete('/course/:id', auth, gpaCtrl.deleteCourse);

module.exports = router;
