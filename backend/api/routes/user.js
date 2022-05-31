const express = require("express");

const User = require("../models/user");
const auth = require("../middleware/auth"); /* TODO: Change auth to authenticate. */

const router = new express.Router();

router.get("/users/me", auth, async (req, res) => {
  res.send({ success: true, user: req.user });
});

router.post("/users", async (req, res) => {
  // TODO: Validate what properties can be in a req.body.
  const user = new User(req.body);

  try {
    const usernameCheck = await User.findOne({ username: req.body.username });
    const mailCheck = await User.findOne({ email: req.body.email });

    if (usernameCheck) {
      throw new Error("Username already exists.");
    }

    if (mailCheck) {
      throw new Error("Email already exists.");
    }

    await user.save();
    const token = await user.generateAuthToken();
    const value = req.body.value;

    res.status(201).send({ success: true, user: user, token: token });
  } catch (error) {
    res.status(400).send({ success: false, error: error.message });
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.username,
      req.body.password
    );

    // When user logs in and is issued a token, updates lastLogin to current time.
    user.lastLogin = Date.now();

    const token = await user.generateAuthToken();

    res.status(200).send({
      success: true,
      user: user,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, error: error.message });
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();

    res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    // Removes all tokens that are saved for user.
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);

  const allowedUpdates = ["username", "email", "password", "isNotified"];

  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res
      .status(400)
      .send({ success: false, error: "At least one update is invalid." });
  }

  try {
    const usernameCheck = await User.findOne({ username: req.body.username });
    const mailCheck = await User.findOne({ email: req.body.email });

    if (usernameCheck) {
      throw new Error("Username already exists.");
    }

    if (mailCheck) {
      throw new Error("Email already exists.");
    }

    const user = await User.findById(req.user._id);

    updates.forEach((update) => {
      user[update] = req.body[update];
    });

    user.updatedIn = Date.now();

    await user.save();

    res.status(200).send({ success: true, user: user });
  } catch (error) {
    res.status(400).send({ success: false, error: error.message });
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.status(200).send({ success: true, user: req.user });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});

module.exports = router;
