import asyncHandler from "../middleware/asyncHandler.js";
import TrainingType from "../models/trainingTypeModel.js";
import Workout from "../models/myWorkoutModel.js";
// @desc Fetch all TrainingTypes
// @route get /api/TrainingTypes
// @access Public

const getTrainingTypes = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};

  const count = await TrainingType.countDocuments({ ...keyword });

  const trainingTypes = await TrainingType.find({ ...keyword })
    .sort({ createdAt: -1 }) // newest trainingTypes first
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({ trainingTypes, page, pages: Math.ceil(count / pageSize) });
});

// @desc Fetch a trainingType
// @route get /api/TrainingTypes/:id
// @access Public

const getTrainingTypeById = asyncHandler(async (req, res) => {
  const trainingType = await TrainingType.findById(req.params.id);

  if (trainingType) {
    res.json(trainingType);
  } else {
    res.status(404);
    throw new Error("Recurso não encontrado.");
  }
});

// @desc create a new trainingType
// @route post /api/TrainingTypes
// @access private admin

const createTrainingType = asyncHandler(async (req, res) => {
  const trainingType = new TrainingType({
    name: "-",
    user: req.user._id,   
    category: "grupo muscular",
    description: `Adicionar séries erepetições`,
  });

  const createdTrainingType = await trainingType.save();
  res.status(201).json(createdTrainingType);
});

// @desc update a trainingType
// @route PUT  /api/trainingType/:id
// @access private admin

const updateTrainingType = asyncHandler(async (req, res) => {
  const { name, description, category } = req.body;

  const trainingType = await TrainingType.findById(req.params.id);

  if (trainingType) {
    trainingType.name = name;
    trainingType.description = description;    
    trainingType.category = category;

    const updatedTrainingType = await trainingType.save();
    res.json(updatedTrainingType);
  } else {
    res.status(404);
    throw new Error("Training Type not found");
  }
});

// @desc delete a trainingType
// @route delete  /api/trainingType/:id
// @access private admin

const deleteTrainingType = asyncHandler(async (req, res) => {
  const trainingType = await TrainingType.findById(req.params.id);

  if (trainingType) {
    // Remove o treino
    await trainingType.deleteOne();
    // Remove todos os workouts que referenciam esse treino
    await Workout.deleteMany({ trainingType: trainingType._id });
    res
      .status(200)
      .json({
        message: "Treino deletado e removido dos workouts dos usuários",
      });
  } else {
    res.status(404);
    throw new Error("Recurso não encontrado");
  }
});


export {
  getTrainingTypes,
  getTrainingTypeById,
  createTrainingType,
  updateTrainingType,
  deleteTrainingType,  
};
