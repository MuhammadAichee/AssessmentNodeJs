const express = require("express");
const countryRouter = express.Router();
const Country = require("../models/Country");

countryRouter.get("/", async (req, res) => {
  const countries = await Country.find();
  res.status(200).json({ country: countries });
});


module.exports = countryRouter;
