import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    lastCompletedWorkout: {
      type: String, // Stores the name of the last completed workout for display/history
      default: null,
    },
    currentWorkoutIndex: { // Tracks the user's progress through their assigned workouts
      type: Number,
      default: 0,
    },
    currentTrainingProgramId: { // Optional: If you need to track which program the user is following
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TrainingProgram', // Assuming you have a model called 'TrainingProgram'
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;