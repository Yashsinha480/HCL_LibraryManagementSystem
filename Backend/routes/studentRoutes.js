import express from "express";
import {
  getBorrowedBooks,
  getDueBooks
} from "../controllers/studentController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticate, authorize("student"));
router.get("/borrowed-books", getBorrowedBooks);
router.get("/due-books", getDueBooks);

export default router;
