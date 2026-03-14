import { BorrowRecord } from "../models/BorrowRecord.js";
import { findBookByIdAcrossCategories } from "../models/Book.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { calculateFine } from "../utils/fineCalculator.js";

const mapBorrowData = async (record) => {
  const isReturned = record.status === "returned";
  const { overdueDays, fineAmount } = calculateFine(
    record.dueDate,
    isReturned ? record.returnDate : new Date()
  );
  const bookRecord = await findBookByIdAcrossCategories(record.bookId, record.bookCategory);

  return {
    id: record._id,
    status: isReturned ? "returned" : "borrowed",
    borrowDate: record.borrowDate,
    dueDate: record.dueDate,
    returnDate: record.returnDate,
    overdueDays,
    fineAmount,
    book: bookRecord?.book || null
  };
};

export const getBorrowedBooks = asyncHandler(async (req, res) => {
  const records = await BorrowRecord.find({ userId: req.user._id })
    .sort({ createdAt: -1 });

  return apiResponse(
    res,
    200,
    "Borrowed books fetched successfully.",
    await Promise.all(records.map(mapBorrowData))
  );
});

export const getDueBooks = asyncHandler(async (req, res) => {
  const records = await BorrowRecord.find({
    userId: req.user._id,
    status: { $in: ["borrowed", "overdue"] }
  })
    .sort({ dueDate: 1 });

  return apiResponse(
    res,
    200,
    "Due books fetched successfully.",
    await Promise.all(records.map(mapBorrowData))
  );
});
