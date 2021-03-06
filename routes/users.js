const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
let auth = require("../middleware/auth");
let User = require("../models/user.model");
const sendEmail = require("./email");

// @desc: register a user
router.post("/register", async (req, res) => {
  try {
    let { email, password, passwordCheck, displayName } = req.body;

    // validation
    if (!email || !password || !passwordCheck || !displayName.trim()) {
      return res.status(400).json({ msg: "Please enter all the fields" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ msg: "Password should be at least 6 characters" });
    }

    if (password !== passwordCheck) {
      return res
        .status(400)
        .json({ msg: "Please enter the same password twice" });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        msg: "The email address is already in use by another account.",
      });
    }

    sendEmail.sendEmail(email, displayName);

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: passwordHash,
      displayName,
      highestGrossWpm: 0,
      highestNetWpm: 0,
      progress: [],
    });
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc: login a user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate
    if (!email || !password)
      return res.status(400).json({ msg: "Please enter all the fields" });

    const user = await User.findOne({ email: email });
    if (!user)
      return res
        .status(400)
        .json({ msg: "No account with this email has been registered" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Invalid username or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({
      token,
      user: {
        id: user._id,
        displayName: user.displayName,
        email: user.email,
        userHighestGrossWpm: user.highestGrossWpm,
        userHighestNetWpm: user.highestNetWpm,
        progress: user.progress,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc: verify a user against token
router.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);

    return res.json(true);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// @desc: get username and id of logged in user
router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({
    displayName: user.displayName,
    id: user._id,
    email: user.email,
    userHighestGrossWpm: user.highestGrossWpm,
    userHighestNetWpm: user.highestNetWpm,
    progress: user.progress,
  });
});

// #desc: update progress of user
router.put("/updateProgress/", async (req, res) => {
  try {
    const userId = req.body.userId;
    let progress = req.body.progress;

    if (progress.length > 28) progress.shift();

    const existingUser = await User.findByIdAndUpdate(
      userId,
      { progress },
      { new: true }
    );

    const userToSend = {
      id: userId,
      displayName: existingUser.displayName,
      userHighestNetWpm: existingUser.highestNetWpm,
      email: existingUser.email,
      userId: existingUser.userId,
      progress: existingUser.progress,
    };

    res.json(userToSend);
  } catch (err) {
    res.status(500).json({ err: err.messsage });
  }
});

// @desc: delete a user account
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user);
    res.json(deletedUser);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
