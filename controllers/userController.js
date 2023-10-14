const express = require("express");
const userRouter = express.Router();
const { validationResult } = require("express-validator");
const User = require("../models/User");
const Country = require("../models/Country");
const City = require("../models/City");
const UserValidator = require("../validators/UserValidators");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const authenticateUser = require("../middleware/authenticationMiddleware");

userRouter.get("/", authenticateUser, async (req, res) => {
  try {
    const { search, country, city, state, page, limit, sortBy, sortOrder } =
      req.query;

    const query = {};

    if (search && search.length > 0) {
      query.$or = [
        {
          username: { $regex: search, $options: "i" },
        },
        {
          email: { $regex: search, $options: "i" },
        },
      ];
    }
    if (country) {
      const countryObject = await Country.findOne({ name: country });
      console.log(countryObject);
      if (countryObject) query.country = countryObject._id;
    }
    if (city) {
      const cityObject = await City.findOne({ name: city });
      if (cityObject) query.city = cityObject._id;
    }
    if (state) {
      const stateObject = await State.findOne({ name: state });
      if (stateObject) query.city = stateObject._id;
    }
    const sort = {};
    if (sortBy && sortOrder) {
      sort[sortBy] = sortOrder === "asc" ? 1 : -1; // 1 for ascending, -1 for descending
    }
    let skip = 0;
    let defaultLimit = 10;
    if (page && limit && page > 0 && limit > 0) {
      defaultLimit = limit;
      skip = (page - 1) * defaultLimit;
    }

    const users = await User.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(defaultLimit));
    res.status(200).json({ users: users });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "" });
  }
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
  if (!user) return res.status(401).json({ error: "Invalid username" });

  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) {
    return res
      .status(401)
      .send({ error: "Incorrect password. Please try again." });
  }

  const token = jwt.sign({ userId: user._id }, "assessment", {
    expiresIn: "1h",
  });
  res
    .status(200)
    .send({ email: user.email, username: user.username, token: token });
});

userRouter.get("/check", authenticateUser, async (req, res) => {
  res.status(200).send({ Message: "Authenticate" });
});

userRouter.put("/:id", authenticateUser, UserValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  if (!req.params.id)
    return res.status(400).json({ error: "Please provide user ID" });
  const { email, country, city } = req.body;
  const user = await User.findById(new ObjectId(req.params.id));
  if (!user) {
    return res.status(401).json({ errors: "User not found" });
  }

  const findCountry = await Country.find({ name: country });
  if (!findCountry) {
    return res.status(401).json({ error: "Country not found" });
  }
  const findCity = await City.find({ name: city, country: findCountry._id });
  if (!findCity) {
    return res
      .status(401)
      .json({ error: "City not found related to provided country" });
  }
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { country: findCountry._id, city: findCity._id, email: email },
    { new: true }
  );
  return res.status(200).json(updatedUser);
});

userRouter.delete("/:id", async (req, res) => {
  if (!req.params.id)
    return res.status(400).json({ error: "Please provide user ID" });
  const deletedUser = await User.findByIdAndDelete(new ObjectId(req.params.id));
  if (!deletedUser) {
    return res.status(401).json({ error: "Usser not found" });
  }
  return res.status(200).json({ "Deleted User": deletedUser });
});

module.exports = userRouter;
