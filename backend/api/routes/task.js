const express = require("express");

const Task = require("../models/task");
const User = require("../models/user");

const auth = require("../middleware/auth");

const router = new express.Router();

router.get("/tasks", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user._id });
    res.status(200).send({ success: true, tasks: tasks });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: error.message });
  }
});

router.post("/tasks", auth, async (request, response) => {
  const task = new Task({
    name: request.body
      .name /* TODO: Check if adding other parameters breaks this. */,
    createdBy: request.user._id,
  });

  try {
    await task.save();
    response.status(201).send({ success: true, task: task });
  } catch (error) {
    response.status(400).send({ success: false, error: error.message });
  }
});

// TODO: Change up the function more.
router.patch("/tasks/:id", auth, async (req, res) => {
  const requestedUpdates = Object.keys(req.body);
  const allowedUpdates = [
    "category",
    "dueDate",
    "completed",
    "name",
    "description",
    "priority",
  ];

  if (req.body.completed) {
    const user = await User.findById(req.user._id);

    user.doneTasks++;
    user.save();
    console.log("doneTasks:", user.doneTasks);
  }

  const isValid = requestedUpdates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValid) {
    return res
      .status(400)
      .send({ success: false, error: "Updates not permitted." });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!task) {
      return res
        .status(404)
        .send({ success: false, error: "Task has not been found." });
    }

    requestedUpdates.forEach((update) => {
      task[update] = req.body[update];
    });

    await task.save();

    res.send({ success: true, task: task });
  } catch (error) {
    res.status(400).send({ success: false, error: error.message });
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    console.log(req.params.id);
    console.log(req.user._id);

    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!task) {
      return res
        .status(404)
        .send({ success: false, error: "Task has not been found." });
    }

    res.send({ success: true, task: task });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});

module.exports = router;
