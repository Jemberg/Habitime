const express = require("express");

const Task = require("../models/task");
const auth = require("../middleware/auth");

const router = new express.Router();

router.get("/tasks", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user._id });
    res.send(tasks);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!task) {
      return res.status(404).send();
    }

    res.status(200).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    createdBy: req.user._id,
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
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

  const isValid = requestedUpdates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValid) {
    return res.status(400).send({ error: "Updates not permitted." });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!task) {
      return res.status(404).send();
    }

    requestedUpdates.forEach((update) => {
      task[update] = req.body[update];
    });

    await task.save();

    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
