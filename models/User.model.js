const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  image: String,
  name: String,
  bio: String,
  phone: Number,
  email: String,
  password: String,
});

const UserModel = mongoose.model("user", userSchema);

module.exports = { UserModel };
