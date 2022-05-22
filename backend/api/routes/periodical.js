const express = require("express");
const moment = require("moment"); // require
moment().format();

const User = require("../models/user");
const Periodical = require("../models/periodical");
const auth = require("../middleware/auth");
const { utc } = require("moment");

const router = new express.Router();

router.get("/periodical", auth, async (request, response) => {
  try {
    let periodicals = await Periodical.find({ createdBy: request.user._id });

    for (let periodical of periodicals) {
      if (periodical.nextDueDate < new Date()) {
        console.log("Task due date being set further and task is uncompleted.");
        let newDueDate = moment().utc().toDate();
        switch (periodical.frequency) {
          case "Monthly":
            newDueDate = moment()
              .utc()
              .startOf("month")
              .add(1, "month")
              .toDate();
            break;
          case "Weekly":
            newDueDate = moment()
              .utc()
              .startOf("isoWeek")
              .add(1, "week")
              .toDate();
            break;
          case "Daily":
            newDueDate = moment().utc().startOf("day").add(1, "day").toDate();
            break;
          default:
            break;
        }

        await Periodical.findByIdAndUpdate(periodical.id, {
          completed: false,
          nextDueDate: newDueDate,
        }).exec();
      }
    }

    const checkedPeriodicals = await Periodical.find({
      createdBy: request.user._id,
    });

    checkedPeriodicals.forEach((periodical) =>
      console.log("Periodicals sent to the front end:", periodical.nextDueDate)
    );

    response
      .status(200)
      .send({ success: true, periodicals: checkedPeriodicals });
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

  console.log(request.body.frequency);

  switch (request.body.frequency) {
    case "Monthly":
      request.body.nextDueDate = moment()
        .utc()
        .startOf("month")
        .add(1, "month")
        .toDate();
      break;
    case "Weekly":
      request.body.nextDueDate = moment()
        .utc()
        .startOf("isoWeek")
        .add(1, "week")
        .toDate();
      break;
    case "Daily":
      request.body.nextDueDate = moment()
        .utc()
        .startOf("day")
        .add(1, "day")
        .toDate();
      break;
    default:
      break;
  }

  if (request.body.completed) {
    const user = await User.findById(request.user._id);

    user.doneRecurring++;
    user.save();
    console.log("doneRecurring:", user.doneRecurring);
  }

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

    if (request.body.nextDueDate) {
      console.log(request.body.nextDueDate);
      periodical["nextDueDate"] = request.body.nextDueDate;
      await periodical.save();
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
