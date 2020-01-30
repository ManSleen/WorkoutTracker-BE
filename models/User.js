const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SetSchema = Schema({
  number: {
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  reps: {
    type: Number,
    required: true
  },
  completed: {
    type: Boolean,
    required: true,
    default: false
  }
});

const ExerciseSchema = Schema({
  name: {
    type: String,
    required: true
  },
  sets: [SetSchema]
});

const WorkoutSchema = Schema({
  name: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  exercises: [ExerciseSchema]
});

const UserSchema = Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  bio: String,
  workouts: [WorkoutSchema]
});

const User = mongoose.model("user", UserSchema);

module.exports = User;
