const express = require("express");

const Habit = require("../models/habit");
const auth = require("../middleware/auth");

const router = new express.Router();

router.get("/habits", auth, async (request, response) => {
  try {
    const habits = await Habit.find({ createdBy: request.user._id });
    response.send(habits);
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

router.get("/habits/:id", auth, async (request, response) => {
  try {
    const habit = await Habit.findOne({
      _id: request.params.id,
      createdBy: request.user._id,
    });

    if (!habit) {
      // TODO: Add json responses where possible in code.
      return response.status(404).json({ error: "Habit has not been found." });
    }

    response.status(200).send(habit);
  } catch (error) {
    response.status(500).send(error);
  }
});

router.post("/habits", auth, async (request, response) => {
  const habit = new Habit({
    ...request.body,
    createdBy: request.user._id,
  });

  try {
    await habit.save();
    response.status(201).send(habit);
  } catch (error) {
    response.status(400).send(error);
  }
});

// TODO: Change up the function more.
router.patch("/habits/:id", auth, async (request, response) => {
  const requestedUpdates = Object.keys(request.body);

  const allowedUpdates = [
    "category",
    "name",
    "description",
    "priority",
    "counter",
    "goal",
    "frequency",
  ];

  const isValid = requestedUpdates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValid) {
    return response.status(400).send({ error: "Updates not permitted." });
  }

  try {
    const habit = await Habit.findOne({
      _id: request.params.id,
      createdBy: request.user._id,
    });

    if (!habit) {
      return response.status(404).send();
    }

    requestedUpdates.forEach((update) => {
      habit[update] = request.body[update];
    });

    await habit.save();

    response.send(habit);
  } catch (error) {
    response.status(400).send(error);
  }
});

router.delete("/habits/:id", auth, async (request, response) => {
  try {
    const habit = await Habit.findOneAndDelete({
      _id: request.params.id,
      createdBy: request.user._id,
    });

    if (!habit) {
      return response.status(404).send();
    }

    response.send(habit);
  } catch (error) {
    response.status(500).send(error);
  }
});
