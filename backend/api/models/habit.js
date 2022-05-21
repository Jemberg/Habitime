const mongoose = require("mongoose");
const User = require("../models/user");

const habitSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  priority: {
    type: Number,
    default: 3,
  },
  counter: {
    type: Number,
    required: true,
    default: 0,
  },
  goal: {
    type: Number,
    default: 1,
  },
  // TODO: Frequency is set through the front-end.
  resetFrequency: {
    type: String,
    default: "Weekly",
  },
  // TODO: NextReset not available for the user, set in the back-end based on frequency.
  nextReset: {
    type: Date,
    // TODO: Probably won't work, but has to add 7 days to current date.
    default: getNextMonday().setHours(0, 0, 0, 0),
  },
  // Habit cannot be completed, the goal is used for the statistics to see how well the user has done.
});

// TODO: Fix finding next monday.
function getNextMonday() {
  // https://bobbyhadz.com/blog/javascript-get-date-of-next-monday
  const nextMonday = new Date();
  nextMonday.setDate(
    // Add 1 to the day of the week, cause getDay returns values that start with Sunday, 0.
    // Get remainder by using %.
    // If remainder is 0, then it is Monday currently and it has to default to 7 to get the next Monday instead.
    // getDate then returns the day of the month for the next Monday based on those calculations.
    nextMonday.getDate() + ((7 - nextMonday.getDay() + 1) % 7 || 7)
  );
  return nextMonday;
}

const Habit = mongoose.model("habit", habitSchema);

module.exports = Habit;
