import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import borrowRoutes from "./routes/borrowRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { returnBook } from "./controllers/borrowController.js";
import { authenticate } from "./middleware/authMiddleware.js";
import { validateRequest } from "./middleware/validateRequest.js";
import { returnValidator } from "./middleware/validators.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { apiResponse } from "./utils/apiResponse.js";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  apiResponse(res, 200, "Library API is running", null);
});

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);

app.post(
  "/api/return",
  authenticate,
  returnValidator,
  validateRequest,
  returnBook
);

app.use("/api/student", studentRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
