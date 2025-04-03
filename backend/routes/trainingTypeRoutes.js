import express from "express";
const router = express.Router();
import {
  getTrainingTypeById,
  getTrainingTypes,
  createTrainingType,
  updateTrainingType,
  deleteTrainingType,
  createTrainingTypeReview,
  getTopTrainingTypes,
} from "../controllers/trainingTypeController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import checkObjectId from "../middleware/checkObjectId.js";

router
  .route("/")
  .get(getTrainingTypes)
  .post(protect, admin, createTrainingType);
router
  .route("/:id/reviews")
  .post(protect, checkObjectId, createTrainingTypeReview);

router.get("/top", getTopTrainingTypes);

router
  .route("/:id")
  .get(getTrainingTypeById)
  .put(protect, admin, checkObjectId, updateTrainingType)
  .delete(protect, admin, checkObjectId, deleteTrainingType);

export default router;
