const express = require("express");
const cityRouter = express.Router();
const City = require("../models/City");
const Country = require("../models/Country");

cityRouter.get("/:country", async (req, res) => {
  if (!req.params.country)
    return res.status(400).json({ error: "Country is missing" });
  try {
    const countryName = req.params.country;
    const country = await Country.findOne({ name: countryName });
    
    if (!country) return res.status(400).json({ error: "Country not found" });

    const cities = await City.find({ country: country._id });
    return res.status(200).json({ cities: cities });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
});

module.exports = cityRouter;
