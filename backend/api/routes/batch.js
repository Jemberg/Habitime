const express = require("express");

const Task = require("../models/task");
const Periodical = require("../models/periodical");
const Habit = require("../models/habit");

const auth = require("../middleware/auth");

const router = new express.Router();

router.get("/all", auth, async (request, response) => {
  try {
    const tasks = await Task.find({ createdBy: request.user._id });
    const periodicals = await Periodical.find({ createdBy: request.user._id });
    const habits = await Habit.find({ createdBy: request.user._id });

    response.status(200).send({
      success: true,
      tasks: tasks,
      periodicals: periodicals,
      habits: habits,
    });
  } catch (error) {
    response.status(500).send({ success: false, error: error.message });
  }
});
