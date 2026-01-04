const express = require("express");
const router = express.Router();

// TEMP in-memory storage (since you are using localStorage in frontend)
let events = [];

// ➕ ADD EVENT
router.post("/", (req, res) => {
  const { title, date, type } = req.body;

  if (!title || !date || !type) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const newEvent = {
    id: Date.now(),
    title,
    date,
    type,
  };

  events.push(newEvent);
  res.status(201).json(newEvent);
});

// 📥 GET EVENTS
router.get("/", (req, res) => {
  res.json(events);
});

// ❌ DELETE EVENT
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  events = events.filter((e) => e.id !== id);
  res.json({ message: "Event deleted" });
});

module.exports = router;
