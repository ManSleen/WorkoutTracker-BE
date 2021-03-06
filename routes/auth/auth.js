const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const User = require("../../models/User");

// Register a new user
router.post("/register", async (req, res) => {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password);
  user.password = hash;

  const userWithHashedPassword = new User(user);
  try {
    const newUser = await userWithHashedPassword.save();
    const token = generateToken(newUser);
    res.json({ user: newUser, token: token });
  } catch (error) {
    res.json({ message: error });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username: username });
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = generateToken(user);
      res
        .status(200)
        .json({ message: `Welcome ${user.username}!`, token, user });
    } else {
      res.status(400).json({ message: "Couldnt find user" });
    }
  } catch (error) {
    res.json({ message: error });
  }
});

function generateToken(user) {
  const payload = {
    subject: user._id,
    username: user.username
  };

  const options = {
    expiresIn: "1d"
  };

  return jwt.sign(payload, process.env.JWT_SECRET, options);
}

module.exports = router;
