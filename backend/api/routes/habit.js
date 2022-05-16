const express = require("express");

const Habit = require("../models/habit");
const auth = require("../middleware/auth");

const router = new express.Router();

router.get("/habits", auth, async (request, response) => {
  try {
    const habits = await Habit.find({ createdBy: request.user._id });
    response.status(200).send({ success: true, habits: habits });
  } catch (error) {
    console.log(error);
    response.status(500).send({ success: false, error: error.message });
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
      return response
        .status(404)
        .send({ success: false, error: "Habit not found." });
    }

    response.status(200).send({ success: true, habit: habit });
  } catch (error) {
    response.status(500).send({ success: false, error: error.message });
  }
});

router.post("/habits", auth, async (request, response) => {
  const habit = new Habit({
    ...request.body,
    createdBy: request.user._id,
  });

  try {
    await habit.save();
    response.status(201).send({ success: true, habit: habit });
  } catch (error) {
    response.status(400).send({ success: false, error: error.message });
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
      return response
        .status(404)
        .send({ success: false, error: "Habit not found." });
    }

    requestedUpdates.forEach((update) => {
      habit[update] = request.body[update];
    });

    await habit.save();

    response.status(200).send({ success: true, habit: habit });
  } catch (error) {
    response.status(400).send({ success: false, error: error.message });
  }
});

router.delete("/habits/:id", auth, async (request, response) => {
  try {
    const habit = await Habit.findOneAndDelete({
      _id: request.params.id,
      createdBy: request.user._id,
    });

    if (!habit) {
      return response
        .status(404)
        .send({ success: false, error: "Habit was not found." });
    }

    response.status(200).send({ success: true, habit: habit });
  } catch (error) {
    response.status(500).send({ success: false, error: error.message });
  }
});
