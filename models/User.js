const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  picture: {
    type: String,
    default: "./images/default_user.PNG",
  },
  description: String,
  group: {
    type: String,
    enum: ["cats", "dogs", "horses", "snakes"],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
