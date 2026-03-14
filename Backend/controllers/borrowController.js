import { BorrowRecord } from "../models/BorrowRecord.js";
import { findBookByIdAcrossCategories } from "../models/Book.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { calculateFine } from "../utils/fineCalculator.js";

export const borrowBook = asyncHandler(async (req, res) => {
  const { bookId, days = 14 } = req.body;

  const existingOpenRecord = await BorrowRecord.findOne({
    userId: req.user._id,
    bookId,
    status: { $in: ["borrowed", "overdue"] }
  });

  if (existingOpenRecord) {
    throw new ApiError(409, "This book is already borrowed by the current student.");
  }

  const bookRecord = await findBookByIdAcrossCategories(bookId);
  if (!bookRecord) {
    throw new ApiError(404, "Book not found.");
  }

  const { book, model: BookModel, category } = bookRecord;

  if (book.availableCopies < 1) {
    throw new ApiError(409, "No copies are currently available.");
  }

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + Number(days));

  const record = await BorrowRecord.create({
    userId: req.user._id,
    bookId,
    bookCategory: category,
    dueDate,
    status: "borrowed"
  });

  book.availableCopies -= 1;
  await BookModel.findByIdAndUpdate(book._id, {
    $set: { availableCopies: book.availableCopies }
  });

  return apiResponse(res, 201, "Book borrowed successfully.", record);
});

export const returnBook = asyncHandler(async (req, res) => {
  const { recordId } = req.body;
  const record = await BorrowRecord.findById(recordId);

  if (!record) {
    throw new ApiError(404, "Borrow record not found.");
  }

  if (record.status === "returned") {
    throw new ApiError(409, "Book has already been returned.");
  }

  const returnDate = new Date();
  const { overdueDays, fineAmount } = calculateFine(record.dueDate, returnDate);

  record.returnDate = returnDate;
  record.status = "returned";
  await record.save();

  const bookRecord = await findBookByIdAcrossCategories(record.bookId, record.bookCategory);
  if (!bookRecord) {
    throw new ApiError(404, "Book not found.");
  }

  await bookRecord.model.findByIdAndUpdate(record.bookId, {
    $inc: { availableCopies: 1 }
  });

  return apiResponse(res, 200, "Book returned successfully.", {
    record: {
      ...record.toObject(),
      book: bookRecord.book
    },
    overdueDays,
    fineAmount
  });
});
