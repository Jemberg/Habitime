const express = require("express");

const Category = require("../models/category");
const auth = require("../middleware/auth");

const router = new express.Router();

// Sends all categories user has registered.
router.get("/categories", auth, async (request, response) => {
  try {
    const categories = await Category.find({ createdBy: request.user._id });
    response.status(200).send({ success: true, categories: categories });
  } catch (error) {
    response.status(500).send({ success: false, error: error.message });
  }
});

// TODO: Each user has to have default categories when they register, could be added to user registration.

// Get category by ID.
router.get("/categories/:id", auth, async (request, response) => {
  try {
    const category = await Category.findOne({
      _id: request.params.id,
      createdBy: request.user._id,
    });

    if (!category) {
      return response
        .status(404)
        .send({ success: false, error: "Category not found." });
    }

    response.status(200).send({ success: true, category: category });
  } catch (error) {
    response.status(500).send({ success: false, error: error.message });
  }
});

router.post("/categories", auth, async (request, response) => {
  const category = new Category({
    ...request.body,
    createdBy: request.user._id,
  });

  try {
    await category.save();
    response.status(201).send({ success: true, category: category });
  } catch (error) {
    response.status(400).send({ success: false, error: error.message });
  }
});

// TODO: Change up the function more.
router.patch("/categoties/:id", auth, async (request, response) => {
  const requestedUpdates = Object.keys(request.body);

  const allowedUpdates = [
    "name",
    "color",
  ]; /* TODO: Update allowed updates list. */

  const isValid = requestedUpdates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValid) {
    return response
      .status(400)
      .send({ success: false, error: "Updates are invalid." });
  }

  try {
    const category = await Category.findOne({
      _id: request.params.id,
      createdBy: request.user._id,
    });

    if (!category) {
      return response
        .status(404)
        .send({ success: false, error: "Category not found." });
    }

    requestedUpdates.forEach((update) => {
      category[update] = request.body[update];
    });

    await category.save();

    response.status(200).send({ success: true, category: category });
  } catch (error) {
    response.status(400).send({ success: false, error: error.message });
  }
});

router.delete("/categories/:id", auth, async (request, response) => {
  try {
    const category = await Category.findOneAndDelete({
      _id: request.params.id,
      createdBy: request.user._id,
    });

    if (!category) {
      return response
        .status(404)
        .send({ success: false, error: "Category not found." });
    }

    response.status(200).send({ success: true, category: category });
  } catch (error) {
    response.status(500).send({ success: false, error: error.message });
  }
});

module.exports = router;
