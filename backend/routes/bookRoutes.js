import express from "express";
const router = express.Router();
import {
  getBookById,
  getBooks,
  createBook,
  updateBook,
  deleteBook,
  createBookReview,
  getTopBooks,
} from "../controllers/bookController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import checkObjectId from "../middleware/checkObjectId.js";

router.route("/").get(getBooks).post(protect, admin, createBook);
router.route("/:id/reviews").post(protect, checkObjectId,createBookReview);

router.get("/top", getTopBooks);
router
  .route("/:id")
  .get(getBookById)
  .put(protect, admin, checkObjectId, updateBook)
  .delete(protect, admin, checkObjectId, deleteBook);

export default router;
