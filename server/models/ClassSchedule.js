const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  userId: String,
  course: String,
  day: String,
  time: String,
});

module.exports = mongoose.model("ClassSchedule", schema);
