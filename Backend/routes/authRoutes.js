import express from "express";
import { login, loginAdmin, loginStudent, register } from "../controllers/authController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { loginValidator, registerValidator, roleLoginValidator } from "../middleware/validators.js";

const router = express.Router();

router.post("/register", registerValidator, validateRequest, register);
router.post("/login", roleLoginValidator, validateRequest, login);
router.post("/login/student", loginValidator, validateRequest, loginStudent);
router.post("/login/admin", loginValidator, validateRequest, loginAdmin);

export default router;
