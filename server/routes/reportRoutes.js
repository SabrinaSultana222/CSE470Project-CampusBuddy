const router = require("express").Router();
const Todo = require("../models/Todo");
const Class = require("../models/ClassSchedule");
const Event = require("../models/Event");

router.get("/:userId", async (req, res) => {
  res.json({
    totalTasks: await Todo.countDocuments({ userId: req.params.userId }),
    totalClasses: await Class.countDocuments({ userId: req.params.userId }),
    totalEvents: await Event.countDocuments({ userId: req.params.userId }),
  });
});

module.exports = router;
