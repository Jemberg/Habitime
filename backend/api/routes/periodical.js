const express = require("express");

const Periodical = require("../models/periodical");
const auth = require("../middleware/auth");

const router = new express.Router();

router.get("/periodical", auth, async (request, response) => {
  try {
    const habits = await Periodical.find({ createdBy: request.user._id });
    response.send(habits);
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

router.get("/periodical/:id", auth, async (request, response) => {
  try {
    const periodical = await Periodical.findOne({
      _id: request.params.id,
      createdBy: request.user._id,
    });

    if (!periodical) {
      // TODO: Add json responses where possible in code.
      return response
        .status(404)
        .json({ error: "Periodical task has not been found." });
    }

    response.status(200).send(periodical);
  } catch (error) {
    response.status(500).send(error);
  }
});

router.post("/periodical", auth, async (request, response) => {
  const periodical = new Periodical({
    ...request.body,
    createdBy: request.user._id,
  });

  try {
    await periodical.save();
    response.status(201).send(periodical);
  } catch (error) {
    response.status(400).send(error);
  }
});

// TODO: Change up the function more.
router.patch("/periodical/:id", auth, async (request, response) => {
  const requestedUpdates = Object.keys(request.body);

  const allowedUpdates = [
    "category",
    "name",
    "completed",
    "description",
    "priority",
    "frequency",
    "goal",
  ];

  // TODO: Check if goal is met, then automatically mark task as completed.

  const isValid = requestedUpdates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValid) {
    return response.status(400).send({ error: "Updates not permitted." });
  }

  try {
    const periodical = await Periodical.findOne({
      _id: request.params.id,
      createdBy: request.user._id,
    });

    if (!periodical) {
      return response.status(404).send();
    }

    requestedUpdates.forEach((update) => {
      periodical[update] = request.body[update];
    });

    await periodical.save();

    response.send(periodical);
  } catch (error) {
    response.status(400).send(error);
  }
});

router.delete("/periodical/:id", auth, async (request, response) => {
  try {
    const periodical = await Periodical.findOneAndDelete({
      _id: request.params.id,
      createdBy: request.user._id,
    });

    if (!periodical) {
      return response.status(404).send();
    }

    response.send(periodical);
  } catch (error) {
    response.status(500).send(error);
  }
});
