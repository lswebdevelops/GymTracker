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
    price: 0,
    user: req.user._id,
    image: "/images/samplebook2.png",
    brand: "Z",
    category: "grupo muscular",
    countInStock: 0,
    numReviews: 0,
    description: `Adicionar séries erepetições`,
  });

  const createdTrainingType = await trainingType.save();
  res.status(201).json(createdTrainingType);
});

// @desc update a trainingType
// @route PUT  /api/trainingType/:id
// @access private admin

const updateTrainingType = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const trainingType = await TrainingType.findById(req.params.id);

  if (trainingType) {
    trainingType.name = name;
    trainingType.price = price;
    trainingType.description = description;
    trainingType.image = image;
    trainingType.brand = brand;
    trainingType.category = category;
    trainingType.countInStock = countInStock;

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
    res.status(200).json({ message: "Treino deletado e removido dos workouts dos usuários" });
  } else {
    res.status(404);
    throw new Error("Recurso não encontrado");
  }
});

// @desc create a new review
// @route post  /api/trainingTypes/:id/reviews
// @access private

const createTrainingTypeReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const trainingType = await TrainingType.findById(req.params.id);

  if (trainingType) {
    const alreadyReviewed = trainingType.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Obra já avaliada.");
    }
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    trainingType.reviews.push(review);

    trainingType.numReviews = trainingType.reviews.length;

    trainingType.rating =
      trainingType.reviews.reduce((acc, review) => acc + review.rating, 0) /
      trainingType.reviews.length;

    await trainingType.save();
    res.status(201).json({ message: "Avaliação adicionada" });
  } else {
    res.status(404);
    throw new Error("Recurso não encontrado");
  }
});

// @desc get top rated trainingType
// @route get /api/trainingTypes/top
// @access Public

const getTopTrainingTypes = asyncHandler(async (req, res) => {
  const trainingTypes = await TrainingType.find({}).sort({ rating: -1 }).limit(3);
  res.status(200).json(trainingTypes);
});
export {
  getTrainingTypes,
  getTrainingTypeById,
  createTrainingType,
  updateTrainingType,
  deleteTrainingType,
  createTrainingTypeReview,
  getTopTrainingTypes,
};
