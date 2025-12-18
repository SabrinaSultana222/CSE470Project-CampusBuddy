const router = require("express").Router();
const Todo = require("../models/Todo");

// create task
router.post("/", async (req, res) => {
  const todo = await Todo.create(req.body);
  res.json(todo);
});

// get student tasks
router.get("/:userId", async (req, res) => {
  const todos = await Todo.find({ userId: req.params.userId });
  res.json(todos);
});

// mark complete
router.patch("/:id", async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(todo);
});

module.exports = router;
