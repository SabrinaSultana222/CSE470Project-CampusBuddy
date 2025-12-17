// DEPRECATED: Course model has been replaced by embedded `Gpa` model.
// Please run `node scripts/migrate_courses_to_gpa.js` to migrate existing Course documents
// into the new `Gpa` model and then remove or ignore this file.

const mongoose = require('mongoose');

module.exports = mongoose.model('Course', new mongoose.Schema({}, { strict: false }));
