const City = require("../models/City");
const State = require("../models/State");

async function getCitiesByState(stateName) {
  try {
    const state = await State.findOne({ name: stateName });

    if (!state) {
      return { error: "State not found" };
    }

    const cities = await City.find({ state: state._id });
    return { cities };
  } catch (err) {
    return { error: err };
  }
}

module.exports = {
  getCitiesByState,
};
