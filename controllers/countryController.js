const express = require("express");
const countryRouter = express.Router();
const countryService = require("../services/countryService");

countryRouter.get("/", async (req, res) => {
  const result = await countryService.getCountries();

  if (result.error) {
    return res.status(500).json({ error: result.error });
  }

  return res.status(200).json({ countries: result.countries });
});

module.exports = countryRouter;
