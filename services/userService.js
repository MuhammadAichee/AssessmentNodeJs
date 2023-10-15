const User = require("../models/User");
const Country = require("../models/Country");
const City = require("../models/City");
const State = require("../models/State");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

async function createUser(username, email, password, country, state, city) {
  const findCountry = await findCountryByName(country);
  if (!findCountry) {
    return { error: "Invalid Country" };
  }

  const findState = await findStateByName(state);
  if (!findState) {
    return { error: "Invalid State" };
  }

  const findCity = await findCityByName(city);
  if (!findCity) {
    return { error: "Invalid City" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    username,
    email,
    password: hashedPassword,
    country: findCountry._id,
    state: findState._id,
    city: findCity._id,
  });

  const savedUser = await user.save();
  return savedUser;
}

async function findCountryByName(countryName) {
  return await Country.findOne({ name: countryName });
}

async function findStateByName(stateName) {
  return await State.findOne({ name: stateName });
}

async function findCityByName(cityName) {
  return await City.findOne({ name: cityName });
}

async function loginUser(username, password) {
  const user = await User.findOne({ username });
  if (!user) {
    return { error: "Invalid username" };
  }

  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) {
    return { error: "Incorrect password. Please try again." };
  }

  const token = jwt.sign({ userId: user._id }, "assessment", {
    expiresIn: "1h",
  });

  return { email: user.email, username: user.username, token };
}

async function updateUser(userId, email, country, state, city) {
  const user = await User.findById(userId);
  if (!user) {
    return { error: "User not found" };
  }

  const findCountry = await findCountryByName(country);
  if (!findCountry) {
    return { error: "Country not found" };
  }

  const findCity = await findCityByName(city);
  if (!findCity) {
    return { error: "City not found related to the provided country" };
  }

  const findState = await findStateByName(state);

  if (!findState) {
    return { error: "State not found related to the provided country" };
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      country: findCountry._id,
      city: findCity._id,
      state: findState._id,
      email,
    },
    { new: true }
  );

  return updatedUser;
}

async function deleteUserById(userId) {
    if (!userId) {
      return { error: "Please provide user ID" };
    }
  
    const deletedUser = await User.findByIdAndDelete(new ObjectId(userId));
    if (!deletedUser) {
      return { error: "User not found" };
    }
  
    return { message: "User deleted successfully", deletedUser };
  }

  
module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUserById,
  findCountryByName,
  findCityByName,
  findStateByName
};
