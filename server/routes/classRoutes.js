const router = require("express").Router();
const Class = require("../models/ClassSchedule");

router.post("/", async (req, res) => {
  res.json(await Class.create(req.body));
});

router.get("/:userId", async (req, res) => {
  try {
    // Build query
    const query = { userId: req.params.userId };
    
    // Search by course name
    if (req.query.search) {
      query.course = { $regex: req.query.search, $options: 'i' };
    }
    
    // Filter by day
    if (req.query.day) {
      query.day = req.query.day;
    }
    
    // Filter by time
    if (req.query.time) {
      query.time = req.query.time;
    }
    
    const classes = await Class.find(query);
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
