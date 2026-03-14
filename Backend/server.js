import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import { connectDatabase } from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import borrowRoutes from "./routes/borrowRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Controllers
import { returnBook } from "./controllers/borrowController.js";

// Middleware
import { authenticate } from "./middleware/authMiddleware.js";
import { validateRequest } from "./middleware/validateRequest.js";
import { returnValidator } from "./middleware/validators.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// Utils
import { apiResponse } from "./utils/apiResponse.js";

const app = express();

// --------------------
// Middleware
// --------------------
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------------------
// Health Check Route
// --------------------
app.get("/api/health", (_req, res) => {
  apiResponse(res, 200, "Library API is running", null);
});

// --------------------
// API Routes
// --------------------
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);

// Return Book Route
app.post(
  "/api/return",
  authenticate,
  returnValidator,
  validateRequest,
  returnBook
);

app.use("/api/student", studentRoutes);
app.use("/api/admin", adminRoutes);

// --------------------
// Error Handling
// --------------------
app.use(notFound);
app.use(errorHandler);

// --------------------
// Start Server
// --------------------
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDatabase();
    console.log("MongoDB Connected Successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();