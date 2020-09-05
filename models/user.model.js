const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 5 },
  displayName: { type: String, required: true },
  highestGrossWpm: { type: Number },
  highestNetWpm: { type: Number },
  progress: { type: Array },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
