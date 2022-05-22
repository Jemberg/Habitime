const mongoose = require("mongoose");

const periodicalSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
  },
  creationDate: {
    type: Date,
    default: new Date(),
  },
  completed: {
    type: Boolean,
    default: false,
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
  frequency: {
    type: String,
    default: "Daily",
  },
  // TODO: Make sure that if frequency is not daily, nextDueDate is different as well.
  // TODO: nextDueDate triggers a function that unchecks the complete state and adds completed task to user total score.
  nextDueDate: {
    type: Date,
    default: getNextDay().setHours(0, 0, 0, 0),
  },
});

function getNextDay() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
}

periodicalSchema.statics.checkRecurring = async () => {
  const periodical = Periodical.findById(id);
  periodical.completed = false;

  switch (periodical.frequency) {
    case "Monthly":
      periodical.nextDueDate = moment()
        .utc()
        .startOf("month")
        .add(1, "month")
        .toDate();
      break;
    case "Weekly":
      periodical.nextDueDate = moment()
        .utc()
        .startOf("isoWeek")
        .add(1, "week")
        .toDate();
      break;
    case "Daily":
      periodical.nextDueDate = moment()
        .utc()
        .startOf("day")
        .add(1, "day")
        .toDate();
      break;
    default:
      break;
  }

  periodical.save();
};

const Periodical = mongoose.model("periodical", periodicalSchema);

module.exports = Periodical;
