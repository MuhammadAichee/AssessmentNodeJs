const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type : String,
    required : true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password : {
    type: String,
    required: true,
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country",
    required: true
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
    required: true
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "State",
    required: true
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
