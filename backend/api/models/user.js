require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const Task = require("./task");
const Habit = require("./habit");
const Periodical = require("./periodical");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    trim: true,
    validate(value) {
      if (value.length < 8) {
        // TODO: Add extra password rules, not just length.
        throw new Error("Password is too short, has to be at least 7 symbols.");
      }
    },
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email.");
      }
    },
  },
  createdIn: {
    type: Date,
    default: new Date(),
  },
  updatedIn: {
    type: Date,
    default: new Date(),
  },
  lastLogin: {
    type: Date,
    // When account is created, first token is issued, so this is the first login.
    default: new Date(),
  },
  // TODO: Reset these at the start of the week and show them in a push notification.
  doneTasks: {
    type: Number,
    default: 0,
    min: 0,
  },
  doneRecurring: {
    type: Number,
    default: 0,
    min: 0,
  },
  doneHabits: {
    type: Number,
    default: 0,
    min: 0,
  },
  // TODO: Add custom start day that all tasks start on and count day/week/month from for habits/recurring tasks.
  isNotified: {
    type: Boolean,
    default: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  // TODO: If enough time is left, implement isAdmin with admin panel.
});

userSchema.methods.toJSON = function () {
  const sanitizedOutput = this.toObject();

  delete sanitizedOutput.password;
  delete sanitizedOutput.tokens;

  return sanitizedOutput;
};

userSchema.methods.generateAuthToken = async function () {
  // TODO: Hide secret in .env file that does not get pushed to Github.
  const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET);

  this.tokens = this.tokens.concat({
    token: token,
  });

  await this.save();

  return token;
};

userSchema.statics.findByCredentials = async (username, password) => {
  const user = await User.findOne({ username: username });

  if (!user) {
    throw new Error("Login details invalid.");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Login details invalid.");
  }

  return user;
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

userSchema.pre("remove", async function (next) {
  await Task.deleteMany({ createdBy: this._id });
  await Periodical.deleteMany({ createdBy: this._id });
  await Habit.deleteMany({ createdBy: this._id });
  next();
});

const User = mongoose.model("user", userSchema);

module.exports = User;
