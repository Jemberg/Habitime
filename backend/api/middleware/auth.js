const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.headers.auth_token;
    const verification = jwt.verify(
      token,
      "thisIsASecretMessage"
    ); /* TODO: Change secret. */

    if (verification) {
      req.user = await User.findOne({
        _id: verification._id,
        "tokens.token": token,
      });
      req.token = token;
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({ error: "Authentication failed, please log in. " });
  }
};

module.exports = auth;
