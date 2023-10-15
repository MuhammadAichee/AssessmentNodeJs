const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema({
  name : {
    type: String,
    unique: true
  },
  code : {
    type: String,
    unique: true
  }
});
const Country = mongoose.model("Country", countrySchema);
module.exports = Country;
