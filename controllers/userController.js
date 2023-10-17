const express = require("express");
const userRouter = express.Router();
const { validationResult } = require("express-validator");
const User = require("../models/User");
const Country = require("../models/Country");
const City = require("../models/City");
const State = require("../models/State");
const UserValidator = require("../validators/UserValidators");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const authenticateUser = require("../middleware/authenticationMiddleware");
const userService = require("../services/userService");

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
      const countryObject = await userService.findCountryByName(country);
      if (countryObject) query.country = countryObject._id;
    }
    if (city) {
      const cityObject = await userService.findCityByName(city);
      if (cityObject) query.city = cityObject._id;
    }
    console.log(state)
    if (state) {
      const stateObject = await userService.findStateByName(state);
      console.log(stateObject)
      if (stateObject) query.state = stateObject._id;
    }
    const sort = {};
    if (sortBy && sortOrder) {
      sort[sortBy] = sortOrder === "ascend" ? 1 : -1; // 1 for ascending, -1 for descending
    }
    else{
      sort["username"] = 1
    }
    let skip = 0;
    let defaultLimit = 10;
    if (page && limit && page > 0 && limit > 0) {
      defaultLimit = limit;
      skip = (page - 1) * defaultLimit;
    }

    const users = await User.find(query)
      .populate("country", "name")
      .populate("city", "name")
      .populate("state", "name")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(defaultLimit));

    const count = await User.find(query);
    res.status(200).json({ users: users, count: count.length });
  } catch (err) {
    res.status(500).json({ error: "" });
  }
});

userRouter.post("/", async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      username,
      email,
      password,
      country,
      confirmPassword,
      state,
      city,
    } = req.body;

    if (!confirmPassword || password !== confirmPassword) {
      return res
        .status(400)
        .json({ errors: "Password is not matched with confirm password" });
    }

    const result = await userService.createUser(
      username,
      email,
      password,
      country,
      state,
      city
    );

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(201).json(result);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

userRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const result = await userService.loginUser(username, password);

  if (result.error) {
    return res.status(401).json({ error: result.error });
  }

  return res.status(200).send(result);
});

userRouter.put("/:id", authenticateUser, UserValidator, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ error: "Please provide user ID" });
    }
    const { email, country, city, state } = req.body;

    const result = await userService.updateUser(userId, email, country, state, city);

    if (result.error) {
      return res.status(401).json({ error: result.error });
    }

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

userRouter.delete("/:id", async (req, res) => {
  const userId = req.params.id;
  const result = await userService.deleteUserById(userId);

  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  return res.status(200).json({ message: "Deleted User", deletedUser: result.deletedUser });
});

module.exports = userRouter;
