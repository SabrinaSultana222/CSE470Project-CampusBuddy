const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  userId: String,
  title: String,
  date: String,
});

module.exports = mongoose.model("Event", EventSchema);
