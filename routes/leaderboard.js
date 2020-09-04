const router = require("express").Router();
const Leaderboard = require("../models/leaderboard.model");
const User = require("../models/user.model");
const express = require("express");
const path = require("path");

// @desc: add a new record
router.post("/add", async (req, res) => {
  const userId = req.body.userId;
  const name = req.body.name;
  const netWpm = req.body.netWpm;

  // 1. update leaderboard
  const user = await Leaderboard.findOne({ userId });
  if (user) {
    try {
      const updatedUser = await Leaderboard.findOneAndUpdate(
        { userId },
        {
          highestNetWpm: netWpm,
        }
      );
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    const newEntry = new Leaderboard({
      userId,
      name,
      highestNetWpm: netWpm,
    });
    newEntry.save().catch((err) => res.status(400).json("Error: ", +err));
  }

  // 2. update user profile
  try {
    const existingUser = await User.findByIdAndUpdate(
      userId,
      {
        highestNetWpm: netWpm,
      },
      { new: true }
    );
    const userToSend = {
      displayName: existingUser.displayName,
      userHighestNetWpm: existingUser.highestNetWpm,
      email: existingUser.email,
      userId: existingUser.userId,
    };
    res.json(userToSend);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc: get all data
router.route("/getData").get((req, res) => {
  Leaderboard.find({})
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
