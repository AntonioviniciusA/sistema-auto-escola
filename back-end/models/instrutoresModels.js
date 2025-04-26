const mongoose = require("mongoose");

const InstructorSchema = new mongoose.Schema({
  usuario: { type: String, required: true },
  email: { type: String, required: true },
});

const Instructor = mongoose.model("Instructor", InstructorSchema);

module.exports = Instructor;
