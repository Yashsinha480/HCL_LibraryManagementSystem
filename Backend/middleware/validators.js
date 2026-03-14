import { body, param, query } from "express-validator";
import { BOOK_CATEGORIES } from "../models/Book.js";

export const registerValidator = [
  body("name").trim().notEmpty().withMessage("Name is required."),
  body("email").isEmail().withMessage("A valid email is required."),
  body("role")
    .optional()
    .isIn(["student", "admin"])
    .withMessage("Role must be student or admin."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long.")
];

export const loginValidator = [
  body("email").isEmail().withMessage("A valid email is required."),
  body("password").notEmpty().withMessage("Password is required.")
];

export const roleLoginValidator = [
  body("email").isEmail().withMessage("A valid email is required."),
  body("role")
    .notEmpty()
    .isIn(["student", "admin"])
    .withMessage("Role must be student or admin."),
  body("password").notEmpty().withMessage("Password is required.")
];

export const bookValidator = [
  body("title").trim().notEmpty().withMessage("Title is required."),
  body("author").trim().notEmpty().withMessage("Author is required."),
  body("isbn").trim().notEmpty().withMessage("ISBN is required."),
  body("category").trim().notEmpty().withMessage("Category is required."),
  body("category")
    .trim()
    .isIn(BOOK_CATEGORIES)
    .withMessage(`Category must be one of: ${BOOK_CATEGORIES.join(", ")}.`),
  body("totalCopies").isInt({ min: 1 }).withMessage("Total copies must be at least 1."),
  body("availableCopies")
    .isInt({ min: 0 })
    .withMessage("Available copies must be zero or more.")
];

export const mongoIdValidator = [
  param("id").isMongoId().withMessage("A valid resource id is required.")
];

export const borrowValidator = [
  body("bookId").isMongoId().withMessage("A valid book id is required."),
  body("days")
    .optional()
    .isInt({ min: 1, max: 30 })
    .withMessage("Borrow duration must be between 1 and 30 days.")
];

export const returnValidator = [
  body("recordId").isMongoId().withMessage("A valid borrow record id is required.")
];

export const paginationValidator = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be greater than 0."),
  query("limit").optional().isInt({ min: 1, max: 50 }).withMessage("Limit must be between 1 and 50.")
];

export const registrationDecisionValidator = [
  param("id").isMongoId().withMessage("A valid user id is required."),
  body("status")
    .isIn(["approved", "rejected"])
    .withMessage("Status must be approved or rejected.")
];
