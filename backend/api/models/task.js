const mongoose = require("mongoose");
const validator = require("validator");

const taskSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  // TODO: Implement relationship to category class.
  dueDate: {
    type: Date,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completionDate: {
    type: Date,
  },
  taskName: {
    type: String,
    required: true,
    trim: true,
  },
  taskDesc: {
    type: String,
    required: true,
    trim: true,
  },
  priority: {
    type: Number,
    default: 3,
  },
  taskType: {
    type: String,
    required: true,
  },
  counter: {
    type: Number,
    default: 0,
  },
  goal: {
    type: Number,
    default: 1,
  },
  frequency: {
    type: String,
    default: "Daily",
  },
});

const Task = mongoose.model("task", taskSchema);

module.exports = Task;
