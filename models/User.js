const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type : String,
    required : true
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

userSchema.pre("save", async function(next) {
  const user = this;
  if(!user.isModified("password")) return next;

  try{
    const salt = await bcrypt.genSalt(100);
    const encryptedPassword = await bcrypt.hash(user.password, salt);
    user.password = encryptedPassword;
    next();
  }
  catch(err){
    return next(err);
  }
})
const User = mongoose.model("User", userSchema);
module.exports = User;
