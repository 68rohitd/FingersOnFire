const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const leaderboardSchema = new Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    highestNetWpm: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);

module.exports = Leaderboard;
