const Country = require("../models/Country");

async function getCountries() {
  try {
    const countries = await Country.find();
    return { countries };
  } catch (err) {
    return { error: err };
  }
}

module.exports = {
  getCountries,
};
