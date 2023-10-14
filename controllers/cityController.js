const express = require("express");
const cityRouter = express.Router();
const City = require("../models/City");
const State = require("../models/State");
const Country = require("../models/Country");

cityRouter.get("/:state", async (req, res) => {
  if (!req.params.state)
    return res.status(400).json({ error: "State is missing" });
  try {
    const stateName = req.params.state;
    const state = await State.findOne({ name: stateName });
    
    if (!state) return res.status(400).json({ error: "State not found" });

    const cities = await City.find({ state: state._id });
    return res.status(200).json({ cities: cities });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
});

module.exports = cityRouter;
