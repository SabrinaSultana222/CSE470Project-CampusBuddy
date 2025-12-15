const router = require("express").Router();
const Class = require("../models/ClassSchedule");

router.post("/", async (req, res) => {
  res.json(await Class.create(req.body));
});

router.get("/:userId", async (req, res) => {
  res.json(await Class.find({ userId: req.params.userId }));
});

module.exports = router;
