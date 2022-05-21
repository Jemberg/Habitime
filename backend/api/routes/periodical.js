const express = require("express");

const Periodical = require("../models/periodical");
const auth = require("../middleware/auth");

const router = new express.Router();

router.get("/periodical", auth, async (request, response) => {
  try {
    const periodicals = await Periodical.find({ createdBy: request.user._id });
    response.status(200).send({ success: true, periodicals: periodicals });
  } catch (error) {
    console.log(error);
    response.status(500).send({ success: false, error: error.message });
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
        .send({ success: false, error: "Periodical task has not been found." });
    }

    response.status(200).send({ success: true, periodical: periodical });
  } catch (error) {
    response.status(500).send({ success: false, error: error.message });
  }
});

router.post("/periodical", auth, async (request, response) => {
  const periodical = new Periodical({
    ...request.body,
    createdBy: request.user._id,
  });

  try {
    await periodical.save();
    response.status(201).send({ success: true, periodical: periodical });
  } catch (error) {
    response.status(400).send({ success: false, error: error.message });
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
    "nextDueDate",
  ];

  console.log(request.body);

  // if (request.body[frequency] === "Weekly") {
  //   const nextMonday = new Date();
  //   nextMonday.setDate(
  //     nextMonday.getDate() + ((7 - nextMonday.getDay() + 1) % 7 || 7)
  //   );
  //   request.body[nextDueDate] = nextMonday;
  // }

  // if (request.body[frequency] === "Monthly") {
  //   const nextMonth = new Date();
  //   nextMonth.setDate(date.getFullYear(), date.getMonth() + 1, 1);
  //   request.body[nextDueDate] = nextMonth;
  // }

  // console.log(request.body[nextDueDate]);

  const isValid = requestedUpdates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValid) {
    return response
      .status(400)
      .send({ success: false, error: "Update not permitted." });
  }

  try {
    const periodical = await Periodical.findOne({
      _id: request.params.id,
      createdBy: request.user._id,
    });

    if (!periodical) {
      return response
        .status(404)
        .send({ success: false, error: "Periodical task has not been found." });
    }

    requestedUpdates.forEach((update) => {
      periodical[update] = request.body[update];
    });

    await periodical.save();

    response.status(200).send({ success: true, periodical: periodical });
  } catch (error) {
    response.status(400).send({ success: false, error: error.message });
  }
});

router.delete("/periodical/:id", auth, async (request, response) => {
  try {
    const periodical = await Periodical.findOneAndDelete({
      _id: request.params.id,
      createdBy: request.user._id,
    });

    if (!periodical) {
      return response
        .status(404)
        .send({ success: false, error: "Periodical task not found." });
    }

    response.status(200).send({ success: true, periodical: periodical });
  } catch (error) {
    response.status(500).send({ success: false, error: error.message });
  }
});

module.exports = router;
