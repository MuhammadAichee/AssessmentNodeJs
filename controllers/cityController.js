const express = require("express");
const cityRouter = express.Router();
const cityService = require("../services/cityService");

cityRouter.get("/:state", async (req, res) => {
  if (!req.params.state) {
    return res.status(400).json({ error: "State is missing" });
  }

  const stateName = req.params.state;
  const result = await cityService.getCitiesByState(stateName);

  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  return res.status(200).json({ cities: result.cities });
});

module.exports = cityRouter;
