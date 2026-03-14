import express from "express";
import {
  createBook,
  deleteBook,
  getBookById,
  getBooks,
  updateBook
} from "../controllers/bookController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  bookValidator,
  mongoIdValidator,
  paginationValidator
} from "../middleware/validators.js";

const router = express.Router();

router.get("/", paginationValidator, validateRequest, getBooks);
router.get("/:id", mongoIdValidator, validateRequest, getBookById);
router.post("/", authenticate, authorize("admin"), bookValidator, validateRequest, createBook);
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  mongoIdValidator,
  bookValidator,
  validateRequest,
  updateBook
);
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  mongoIdValidator,
  validateRequest,
  deleteBook
);

export default router;
