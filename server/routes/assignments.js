const express = require("express");
const router = express.Router();
const Assignment = require("../models/Assignment");
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const safe = Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.-_]/g, '_');
    cb(null, safe);
  }
});


const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // allow common document formats and images (client accepts image previews)
    const allowed = ['.pdf', '.doc', '.docx', '.ipynb', '.py', '.txt', '.md', '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('File type not allowed'));
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

const assignmentsCtrl = require('../controllers/assignmentsController');

// ADD (protected)
router.post(
  "/add",
  auth,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('dueDate').notEmpty().withMessage('dueDate is required').bail().isISO8601().withMessage('dueDate must be a valid date').bail().custom((value) => {
      const d = new Date(value);
      const now = new Date();
      if (d < new Date(now.toDateString())) throw new Error('dueDate must not be in the past');
      return true;
    }),
    body('course').notEmpty().withMessage('Course is required'),
  ],
  validate,
  assignmentsCtrl.addAssignment
);

// GET
// GET my assignments (protected)
router.get('/', auth, assignmentsCtrl.getAssignments);

// GET single assignment (protected, must own)
router.get('/:id', auth, assignmentsCtrl.getAssignment);

// UPDATE (protected, must own assignment)
router.put(
  "/update/:id",
  auth,
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('dueDate').optional().isISO8601().withMessage('dueDate must be a valid date').bail().custom((value) => {
      const d = new Date(value);
      const now = new Date();
      if (d < new Date(now.toDateString())) throw new Error('dueDate must not be in the past');
      return true;
    }),
    body('course').optional().notEmpty().withMessage('Course cannot be empty'),
  ],
  validate,
  assignmentsCtrl.updateAssignment
);

// DELETE
// DELETE (protected, must own assignment)
router.delete("/delete/:id", auth, assignmentsCtrl.deleteAssignment);

// Upload / Resubmit a file to an assignment (protected, must own assignment)
router.post('/resubmit/:id', auth, upload.single('file'), assignmentsCtrl.resubmit);

module.exports = router;