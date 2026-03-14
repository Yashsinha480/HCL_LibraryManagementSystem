import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    author: {
      type: String,
      required: true,
      trim: true
    },
    isbn: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    totalCopies: {
      type: Number,
      required: true,
      min: 1
    },
    availableCopies: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

const BOOK_CATEGORY_CONFIG = [
  { value: "Comedy", aliases: ["comedy"], modelName: "ComedyBook", collectionName: "Comedy" },
  { value: "Fantasy", aliases: ["fantasy"], modelName: "FantasyBook", collectionName: "Fantasy" },
  { value: "action", aliases: ["action"], modelName: "ActionBook", collectionName: "action" },
  { value: "adventure", aliases: ["adventure"], modelName: "AdventureBook", collectionName: "adventure" },
  { value: "sc-fi", aliases: ["sc-fi", "sci-fi", "sci fi", "scifi"], modelName: "SciFiBook", collectionName: "sc-fi" }
];

const categoryLookup = new Map();
const bookModels = new Map();

for (const config of BOOK_CATEGORY_CONFIG) {
  categoryLookup.set(config.value.toLowerCase(), config);

  for (const alias of config.aliases) {
    categoryLookup.set(alias.toLowerCase(), config);
  }

  const model =
    mongoose.models[config.modelName] ||
    mongoose.model(config.modelName, bookSchema, config.collectionName);

  bookModels.set(config.value, model);
}

export const BOOK_CATEGORIES = BOOK_CATEGORY_CONFIG.map((config) => config.value);

export const normalizeBookCategory = (category) => {
  if (!category) {
    return null;
  }

  return categoryLookup.get(String(category).trim().toLowerCase())?.value || null;
};

export const getBookModel = (category) => {
  const normalizedCategory = normalizeBookCategory(category);
  return normalizedCategory ? bookModels.get(normalizedCategory) : null;
};

export const getAllBookModels = () =>
  BOOK_CATEGORIES.map((category) => ({
    category,
    model: bookModels.get(category)
  }));

export const attachBookCategory = (book, category) => {
  if (!book) {
    return null;
  }

  const source = typeof book.toObject === "function" ? book.toObject() : book;
  const totalCopies = Number.isFinite(Number(source.totalCopies)) && Number(source.totalCopies) > 0
    ? Number(source.totalCopies)
    : 1;
  const availableCopies = Number.isFinite(Number(source.availableCopies)) && Number(source.availableCopies) >= 0
    ? Number(source.availableCopies)
    : totalCopies;

  return {
    ...source,
    category: source.category || category,
    totalCopies,
    availableCopies
  };
};

export const findBookByIdAcrossCategories = async (bookId, category = null) => {
  if (category) {
    const model = getBookModel(category);
    if (!model) {
      return null;
    }

    const normalizedCategory = normalizeBookCategory(category);
    const book = await model.findById(bookId);
    return book
      ? { book: attachBookCategory(book, normalizedCategory), model, category: normalizedCategory }
      : null;
  }

  for (const { category: currentCategory, model } of getAllBookModels()) {
    const book = await model.findById(bookId);
    if (book) {
      return {
        book: attachBookCategory(book, currentCategory),
        model,
        category: currentCategory
      };
    }
  }

  return null;
};
