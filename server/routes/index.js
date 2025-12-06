const express = require('express');
const router = express.Router();

// TEMP test route – you won't call this from React yet
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Campus Buddy MVC base ready' });
});

// Later: router.use('/users', require('./user.routes'));

module.exports = router;
