const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
  name : {
    type: String
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country",
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "State",
  },
});
const City = mongoose.model("City", citySchema);
module.exports = City;
