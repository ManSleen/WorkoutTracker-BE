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

// Get a user's specific workout by ID
router.get("/:userId/workouts/:workoutId", async (req, res) => {
  try {
    const user = await User.find(
      {
        _id: req.params.userId
      },
      {
        workouts: { $elemMatch: { _id: req.params.workoutId } }
      }
    );

    res.json(user[0].workouts[0]);
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

// Update a workout by ID
router.put("/:userId/workouts/:workoutId", async (req, res) => {
  const updates = req.body;
  try {
    const workout = await User.updateOne(
      { _id: req.params.userId, "workouts._id": req.params.workoutId },
      {
        "workouts.$.name": updates.name,
        "workouts.$.duration": updates.duration
      }
    );
    // const user = await User.findById(req.params.userId);
    // const usersWorkouts = user.workouts;
    res.json(workout);
  } catch (error) {
    res.json({ message: error });
  }
});

// *** Exercises ***

// Get exercises for a specific workout
router.get("/:userId/workouts/:workoutId/exercises", async (req, res) => {
  try {
    const user = await User.find(
      {
        _id: req.params.userId
      },
      {
        workouts: { $elemMatch: { _id: req.params.workoutId } }
      }
    );
    res.json(user[0].workouts[0].exercises);
  } catch (error) {
    res.json({ message: error });
  }
});

// Add an exercise to a specific workout
router.post("/:userId/workouts/:workoutId/exercises", async (req, res) => {
  const exercise = req.body;
  try {
    const addedExercise = await User.updateOne(
      { _id: req.params.userId, "workouts._id": req.params.workoutId },
      {
        $push: { "workouts.$.exercises": exercise }
      }
    );
    res.json(addedExercise);
  } catch (error) {
    res.json({ message: error });
  }
});

// Delete an exercise by ID
router.delete(
  "/:userId/workouts/:workoutId/exercises/:exerciseId",
  async (req, res) => {
    try {
      const deletedExercise = await User.updateOne(
        { _id: req.params.userId },
        {
          $pull: {
            "workouts.$[a].exercises": {
              _id: req.params.exerciseId
            }
          }
        },
        {
          arrayFilters: [
            {
              "a._id": req.params.workoutId
            }
          ]
        }
      );

      res.json(deletedExercise);
    } catch (error) {
      res.json({ message: error });
    }
  }
);

// Update a specific exercise
router.put(
  "/:userId/workouts/:workoutId/exercises/:exerciseId",
  async (req, res) => {
    const changes = req.body;
    try {
      const updatedExercise = await User.updateOne(
        { _id: req.params.userId },
        {
          $set: {
            "workouts.$[].exercises.$[a].name": changes.name
          }
        },
        {
          arrayFilters: [
            {
              "a._id": req.params.exerciseId
            }
          ]
        }
      );
      res.json(updatedExercise);
    } catch (error) {
      res.json({ message: error });
    }
  }
);

// *** Sets ***

// Get all sets for a specific exercise
router.get(
  "/:userId/workouts/:workoutId/exercises/:exerciseId/sets",
  async (req, res) => {
    try {
      const user = await User.find(
        {
          _id: req.params.userId
        },
        {
          workouts: {
            $elemMatch: { _id: req.params.workoutId },
            exercises: { $elemMatch: { _id: req.params.exerciseId } }
          }
        }
      );
      res.json(user[0].workouts[0].exercises[0].sets);
    } catch (error) {
      res.json({ message: error });
    }
  }
);

// Add set to specific exercise
router.post(
  "/:userId/workouts/:workoutId/exercises/:exerciseId/sets",
  async (req, res) => {
    const set = req.body;
    try {
      const something = await User.updateOne(
        {
          _id: req.params.userId,
          "workouts._id": req.params.workoutId,
          "workouts.exercises._id": req.params.exerciseId
        },
        { $push: { "workouts.$.exercises.$[e].sets": set } },
        {
          arrayFilters: [
            {
              "e._id": req.params.exerciseId
            }
          ]
        }
      );
      res.json(something);
    } catch (error) {
      res.json({ message: error });
    }
  }
);

// Update a specific set
router.put(
  "/:userId/workouts/:workoutId/exercises/:exerciseId/sets/:setId",
  async (req, res) => {
    const changes = req.body;
    try {
      const updatedSet = await User.updateOne(
        { _id: req.params.userId },
        {
          $set: {
            "workouts.$[].exercises.$[a].sets.$[b].reps": changes.reps,
            "workouts.$[].exercises.$[a].sets.$[b].number": changes.number,
            "workouts.$[].exercises.$[a].sets.$[b].weight": changes.weight,
            "workouts.$[].exercises.$[a].sets.$[b].completed": changes.completed
          }
        },
        {
          arrayFilters: [
            {
              "a._id": req.params.exerciseId
            },
            {
              "b._id": req.params.setId
            }
          ]
        }
      );
      res.json(updatedSet);
    } catch (error) {
      res.json({ message: error });
    }
  }
);

// // Update a specific exercise
// router.put(
//   "/:userId/workouts/:workoutId/exercises/:exerciseId",
//   async (req, res) => {
//     const changes = req.body;
//     try {
//       const updatedExercise = await User.updateOne(
//         { _id: req.params.userId },
//         {
//           $set: {
//             "workouts.$[].exercises.$[a].name": changes.name
//           }
//         },
//         {
//           arrayFilters: [
//             {
//               "a._id": req.params.exerciseId
//             }
//           ]
//         }
//       );
//       res.json(updatedExercise);
//     } catch (error) {
//       res.json({ message: error });
//     }
//   }
// );

module.exports = router;
