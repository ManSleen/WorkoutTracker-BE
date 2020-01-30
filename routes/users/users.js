const express = require("express");
const router = express.Router();

const User = require("../../models/User");

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.send({ message: error });
  }
});

// Add a new user
router.post("/", async (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    bio: req.body.bio
  });
  try {
    const newUser = await user.save();
    res.json(newUser);
  } catch (error) {
    res.json({ message: error });
  }
});

// Find a specific user
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.json(user);
  } catch (error) {
    res.json({ message: error });
  }
});

// Delete a user
router.delete("/:userId", async (req, res) => {
  try {
    await User.remove({ _id: req.params.userId });
    res.json({ message: `Deleted user with ID ${req.params.userId}` });
  } catch (error) {
    res.json({ message: error });
  }
});

// Update a user
router.put("/:userId", async (req, res) => {
  const updates = req.body;
  try {
    await User.updateOne({ _id: req.params.userId }, updates);
    res.json({ message: `Updated user with ID ${req.params.userId}` });
  } catch (error) {
    res.json({ message: error });
  }
});

// *** WORKOUTS ***

// Get workouts for a specific user
router.get("/:userId/workouts", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const usersWorkouts = user.workouts;
    res.json(usersWorkouts);
  } catch (error) {
    res.json({ message: error });
  }
});

// Add a workout for a specific user
router.post("/:userId/workouts", async (req, res) => {
  try {
    await User.updateOne(
      { _id: req.params.userId },
      { $push: { workouts: req.body } }
    );
    const user = await User.findById(req.params.userId);
    const usersWorkouts = user.workouts;
    res.json(usersWorkouts);
  } catch (error) {
    res.json({ message: error });
  }
});

// Delete a workout by ID
router.delete("/:userId/workouts/:workoutId", async (req, res) => {
  try {
    await User.updateOne(
      { _id: req.params.userId },
      { $pull: { workouts: { _id: req.params.workoutId } } }
    );
    const user = await User.findById(req.params.userId);
    const usersWorkouts = user.workouts;
    res.json(usersWorkouts);
  } catch (error) {
    res.json({ message: error });
  }
});

module.exports = router;
