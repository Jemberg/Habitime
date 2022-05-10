const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const Task = require("./task");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    timestamp: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    trim: true,
    validate(value) {
      if (value.length < 8) {
        throw new Error("A password has to be at least 7 symbols long.");
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
        throw new Error("Format of entered email is invalid.");
      }
    },
  },
  lastLogin: {
    type: Date,
  },
  dayStart: {
    type: String,
    default: "Monday",
  },
  timezoneDiff: {
    type: Number,
    default: 0,
  },
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
});

userSchema.virtual("tasks", {
  ref: "task",
  localField: "_id",
  foreignField: "createdBy",
});

userSchema.methods.toJSON = function () {
  const sanitizedOutput = this.toObject();

  delete sanitizedOutput.password;
  delete sanitizedOutput.tokens;

  return sanitizedOutput;
};

userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id.toString() }, "thisIsASecretMessage");

  this.tokens = this.tokens.concat({
    token: token,
  });

  await this.save();

  return token;
};

// TODO: Change to username and password checking.
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new Error("Unable to login, no user has been found.");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login, password did not match.");
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
  await Task.deleteMany({ owner: this._id });
  next();
});

const User = mongoose.model("user", userSchema);

module.exports = User;
