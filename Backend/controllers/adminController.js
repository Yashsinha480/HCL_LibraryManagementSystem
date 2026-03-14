import { BorrowRecord } from "../models/BorrowRecord.js";
import { findBookByIdAcrossCategories } from "../models/Book.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { calculateFine } from "../utils/fineCalculator.js";

export const getAllUsers = asyncHandler(async (_req, res) => {
  const users = await User.find({ role: { $in: ["student", "admin"] } })
    .select("-password")
    .sort({ createdAt: -1 });

  return apiResponse(res, 200, "Users fetched successfully.", users);
});

export const getAllBorrowedBooks = asyncHandler(async (_req, res) => {
  const records = await BorrowRecord.find()
    .populate("userId", "name email status")
    .sort({ createdAt: -1 });

  const data = await Promise.all(records.map(async (record) => {
    const { overdueDays, fineAmount } = calculateFine(
      record.dueDate,
      record.returnDate || new Date()
    );
    const bookRecord = await findBookByIdAcrossCategories(record.bookId, record.bookCategory);

    return {
      id: record._id,
      borrowDate: record.borrowDate,
      dueDate: record.dueDate,
      returnDate: record.returnDate,
      status:
        !record.returnDate && overdueDays > 0
          ? "overdue"
          : record.status,
      overdueDays,
      fineAmount,
      student: record.userId,
      book: bookRecord?.book || null
    };
  }));

  return apiResponse(res, 200, "Borrowed books fetched successfully.", data);
});

export const reviewRegistration = asyncHandler(async (req, res) => {
  const user = await User.findOneAndUpdate(
    { _id: req.params.id, role: { $in: ["student", "admin"] } },
    { status: req.body.status },
    { new: true }
  ).select("-password");

  if (!user) {
    throw new ApiError(404, "Student not found.");
  }

  return apiResponse(
    res,
    200,
    `${user.role === "admin" ? "Administrator" : "Student"} ${req.body.status} successfully.`,
    user
  );
});
