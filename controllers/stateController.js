const express = require("express");
const stateRouter = express.Router();
const stateService = require("../services/stateService");

stateRouter.get("/:country", async (req, res) => {
  if (!req.params.country) {
    return res.status(400).json({ error: "Country is missing" });
  }

  const countryName = req.params.country;
  const result = await stateService.getStatesByCountry(countryName);

  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  return res.status(200).json({ states: result.states });
});

module.exports = stateRouter;
