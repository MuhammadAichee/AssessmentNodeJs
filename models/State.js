const mongoose = require("mongoose");

const stateSchema = new mongoose.Schema({
  name : String,
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country",
  }
});
const State = mongoose.model("State", stateSchema);
module.exports = State;
