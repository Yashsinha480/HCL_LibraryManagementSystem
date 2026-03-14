import express from "express";
import { borrowBook, returnBook } from "../controllers/borrowController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { borrowValidator, returnValidator } from "../middleware/validators.js";

const router = express.Router();

router.post("/", authenticate, authorize("student"), borrowValidator, validateRequest, borrowBook);
router.post("/return", authenticate, authorize("admin"), returnValidator, validateRequest, returnBook);

export default router;
