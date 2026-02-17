const express = require('express');
const router = express.Router();

// Import the FAQ routes
const faqRoutes = require('./faqRoutes'); // <-- create this file in routes/

// TEMP test route
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Campus Buddy MVC base ready' });
});

// Mount FAQ routes at /api/faqs
router.use('/faqs', faqRoutes);
router.use("/todos", require("./todoRoutes"));

// Later: you can add other routes like:
// router.use('/users', require('./user.routes'));
// router.use('/auth', require('./auth.routes'));

module.exports = router;
