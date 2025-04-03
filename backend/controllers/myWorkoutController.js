import asyncHandler from "../middleware/asyncHandler.js";
import Workout from "../models/myWorkoutModel.js";
import TrainingType from "../models/trainingTypeModel.js"; // Importa TrainingType

// @desc    Get user's workout plan
// @route   GET /api/myWorkout
// @access  Private
const getMyWorkout = asyncHandler(async (req, res) => {
  const workout = await Workout.find({ user: req.user._id }).populate("trainingType");

  if (!workout || workout.length === 0) {
    res.status(404);
    throw new Error("Adicione um Treino");
  }

  res.json(workout);
});

// @desc    Add trainingType to user's workout plan
// @route   POST /api/myWorkout
// @access  Private
const createMyWorkout = asyncHandler(async (req, res) => {
  const { trainingTypeId } = req.body;

  if (!trainingTypeId) {
    res.status(400);
    throw new Error("TrainingType ID is required");
  }

  const trainingType = await TrainingType.findById(trainingTypeId);
  if (!trainingType) {
    res.status(404);
    throw new Error("Treino não encontrado");
  }

  // Verifica se já existe esse treino no workout do usuário
  const existingWorkout = await Workout.findOne({ user: req.user._id, trainingType: trainingTypeId });

  if (existingWorkout) {
    res.status(400);
    throw new Error("Treino já adicionado");
  }

  // Cria a entrada no Workout associada ao treino existente
  const workout = new Workout({
    user: req.user._id,
    trainingType: trainingTypeId,
    status: "pending", // Adicionando um status inicial
  });

  const createdWorkout = await workout.save();
  res.status(201).json(createdWorkout);
});

// @desc    Update user's workout status
// @route   PUT /api/myWorkout/:id
// @access  Private
const updateMyWorkout = asyncHandler(async (req, res) => {
  const updatedWorkout = await Workout.findOneAndUpdate(
    { user: req.user._id, _id: req.params.id },
    { status: req.body.status }, 
    { new: true } // ✅ Retorna o documento atualizado
  );

  if (!updatedWorkout) {
    res.status(404);
    throw new Error("Treino não encontrado");
  }

 
  res.json(updatedWorkout);
});

// @desc    Remove trainingType from user's workout plan
// @route   DELETE /api/myWorkout/:id
// @access  Private
const deleteMyWorkout = asyncHandler(async (req, res) => {
  const workout = await Workout.findOne({ user: req.user._id, _id: req.params.id });

  if (!workout) {
    res.status(404);
    throw new Error("Treino não encontrado");
  }

  await workout.deleteOne();
  res.json({ message: "Treino removido" });
});

export { getMyWorkout, createMyWorkout, updateMyWorkout, deleteMyWorkout };
