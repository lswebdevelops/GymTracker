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
      type: String,
      default: null,
    },
    currentExerciseIndex: { // Novo campo para rastrear o progresso
      type: Number,
      default: 0,
    },
    currentTrainingProgramId: { // Opcional: Se você precisa rastrear qual programa o usuário está seguindo
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TrainingProgram', // Supondo que você tenha um model chamado 'TrainingProgram'
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