import express from "express";
import {
  getAllBorrowedBooks,
  getAllUsers,
  reviewRegistration
} from "../controllers/adminController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { registrationDecisionValidator } from "../middleware/validators.js";

const router = express.Router();

router.use(authenticate, authorize("admin"));
router.get("/borrowed-books", getAllBorrowedBooks);
router.get("/users", getAllUsers);
router.patch("/users/:id/status", registrationDecisionValidator, validateRequest, reviewRegistration);

export default router;
