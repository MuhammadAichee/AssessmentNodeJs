const State = require("../models/State");
const Country = require("../models/Country");

async function getStatesByCountry(countryName) {
  try {
    const country = await Country.findOne({ name: countryName });

    if (!country) {
      return { error: "Country not found" };
    }

    const states = await State.find({ country: country._id });
    return { states };
  } catch (err) {
    return { error: err };
  }
}

module.exports = {
  getStatesByCountry,
};
