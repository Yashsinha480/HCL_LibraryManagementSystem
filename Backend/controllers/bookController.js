import {
  attachBookCategory,
  findBookByIdAcrossCategories,
  getAllBookModels,
  getBookModel,
  normalizeBookCategory
} from "../models/Book.js";
import { BorrowRecord } from "../models/BorrowRecord.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";

const applyAvailability = async (books) => {
  const availability = await Promise.all(
    books.map(async (book) => {
      const openBorrowCount = await BorrowRecord.countDocuments({
        bookId: book._id,
        bookCategory: book.category,
        status: { $in: ["borrowed", "overdue"] }
      });

      return {
        ...book,
        availableCopies: Math.max(book.totalCopies - openBorrowCount, 0)
      };
    })
  );

  return availability;
};

export const getBooks = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const search = req.query.search?.trim();
  const filter = search
    ? {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { author: { $regex: search, $options: "i" } }
        ]
      }
    : {};
  const category = normalizeBookCategory(req.query.category);

  const targetModels = category
    ? [{ category, model: getBookModel(category) }]
    : getAllBookModels();

  const books = (
    await Promise.all(
      targetModels
        .filter(({ model }) => Boolean(model))
        .map(async ({ category: modelCategory, model }) =>
          (await model.find(filter).lean()).map((book) => attachBookCategory(book, modelCategory))
        )
    )
  )
    .flat()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const booksWithAvailability = await applyAvailability(books);
  const total = booksWithAvailability.length;
  const skip = (page - 1) * limit;
  const paginatedBooks = booksWithAvailability.slice(skip, skip + limit);

  return apiResponse(res, 200, "Books fetched successfully.", {
    items: paginatedBooks,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

export const getBookById = asyncHandler(async (req, res) => {
  const result = await findBookByIdAcrossCategories(req.params.id);
  const [book] = result?.book ? await applyAvailability([result.book]) : [];

  if (!book) {
    throw new ApiError(404, "Book not found.");
  }

  return apiResponse(res, 200, "Book fetched successfully.", book);
});

export const createBook = asyncHandler(async (req, res) => {
  const category = normalizeBookCategory(req.body.category);
  const payload = { ...req.body, category };

  if (payload.availableCopies > payload.totalCopies) {
    throw new ApiError(422, "Available copies cannot exceed total copies.");
  }

  const BookModel = getBookModel(category);
  if (!BookModel) {
    throw new ApiError(422, "Invalid book category.");
  }

  const existingBook = await BookModel.findOne({
    title: payload.title.trim(),
    author: payload.author.trim(),
    isbn: payload.isbn.trim(),
    category: payload.category.trim()
  });

  if (existingBook) {
    existingBook.totalCopies += payload.totalCopies;
    existingBook.availableCopies += payload.availableCopies;
    await existingBook.save();

    return apiResponse(res, 200, "Book already exists. Copies updated successfully.", existingBook);
  }

  const book = await BookModel.create(payload);
  return apiResponse(res, 201, "Book created successfully.", attachBookCategory(book, category));
});

export const updateBook = asyncHandler(async (req, res) => {
  const existingRecord = await findBookByIdAcrossCategories(req.params.id);
  if (!existingRecord) {
    throw new ApiError(404, "Book not found.");
  }

  const category = normalizeBookCategory(req.body.category);
  const payload = { ...req.body, category };

  if (payload.availableCopies > payload.totalCopies) {
    throw new ApiError(422, "Available copies cannot exceed total copies.");
  }

  if (existingRecord.category !== category) {
    throw new ApiError(422, "Changing category for an existing book is not supported.");
  }

  const book = await existingRecord.model.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true
  });

  if (!book) {
    throw new ApiError(404, "Book not found.");
  }

  return apiResponse(
    res,
    200,
    "Book updated successfully.",
    attachBookCategory(book, existingRecord.category)
  );
});

export const deleteBook = asyncHandler(async (req, res) => {
  const existingRecord = await findBookByIdAcrossCategories(req.params.id);
  const book = existingRecord
    ? await existingRecord.model.findByIdAndDelete(req.params.id)
    : null;

  if (!book) {
    throw new ApiError(404, "Book not found.");
  }

  return apiResponse(
    res,
    200,
    "Book deleted successfully.",
    attachBookCategory(book, existingRecord.category)
  );
});
