const express = require("express");
const userRouter = express.Router();
const { validationResult } = require("express-validator");
const User = require("../models/User");
const Country = require("../models/Country");
const UserValidator = require("../validators/UserValidators");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateUser = require("../middleware/authenticationMiddleware");

userRouter.get("/", async (req, res) => {
  const users = await User.find();
  res.status(200).json({ users: users });
});

userRouter.post("/", UserValidator, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, email, password, country, confirmPassword } = req.body;
    if (!confirmPassword || password !== confirmPassword) {
      return res
        .status(400)
        .json({ errors: "Password is not matched with confirm password" });
    }
    const findCountry = await Country.findOne({ name: country });
    if (!findCountry) {
      return res.status(400).json({ errors: "Invalid Country" });
    }
    console.log(findCountry);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      country: findCountry._id,
    });
    const savedUser = await user.save();
    return res.status(201).json(savedUser);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

userRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username: username });
  if (!user) return res.status(401).json({ error: "User not found" });

  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) {
    return res.status(401).send({ error: "Incorrect password" });
  }

  const token = jwt.sign({ userId: user._id }, "assessment", {
    expiresIn: "1h",
  });
  res
    .status(200)
    .send({ email: user.email, username: user.username, token: token });
});

userRouter.get("/check", authenticateUser, async (req, res) => {
  res
  .status(200)
  .send({ Message: "Authenticate" });
});
module.exports = userRouter;
