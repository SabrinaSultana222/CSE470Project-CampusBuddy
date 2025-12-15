const express = require("express");
const router = express.Router();

const faqs = [
  { question: "How to add class?", answer: "Go to Class Schedule page." },
  { question: "How to add task?", answer: "Go to To-Do List page." }
];

router.get("/", (req, res) => {
  res.json(faqs);
});

module.exports = router;
