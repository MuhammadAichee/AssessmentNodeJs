const express = require("express");
const stateRouter = express.Router();
const State = require("../models/State");
const Country = require("../models/Country");

stateRouter.get("/:country", async (req, res) => {
  if (!req.params.country)
    return res.status(400).json({ error: "Country is missing" });
  try {
    const countryName = req.params.country;
    const country = await Country.findOne({ name: countryName });
    
    if (!country) return res.status(400).json({ error: "Country not found" });

    const states = await State.find({ country: country._id });
    return res.status(200).json({ states: states });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
});

module.exports = stateRouter;
