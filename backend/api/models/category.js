const mongoose = require("mongoose");
const validator = require("validator");

const categorySchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: "#ff0000",
    validate(value) {
      if (!validator.isHexColor(value)) {
        throw new Error("Invalid HEX color provided.");
      }
    },
  },
});

const Category = mongoose.model("category", categorySchema);

module.exports = Category;
