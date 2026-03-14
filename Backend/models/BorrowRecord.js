import mongoose from "mongoose";
import { BOOK_CATEGORIES } from "./Book.js";

const borrowRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    bookCategory: {
      type: String,
      enum: BOOK_CATEGORIES,
      required: true
    },
    borrowDate: {
      type: Date,
      default: Date.now
    },
    dueDate: {
      type: Date,
      required: true
    },
    returnDate: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: ["borrowed", "returned", "overdue"],
      default: "borrowed"
    }
  },
  {
    timestamps: true
  }
);

export const BorrowRecord = mongoose.model("BorrowRecord", borrowRecordSchema);
