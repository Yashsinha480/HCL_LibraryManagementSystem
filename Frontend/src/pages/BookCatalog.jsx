import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import AlertMessage from "../components/AlertMessage";
import BookCategorySections from "../components/BookCategorySections";
import BookFormModal from "../components/BookFormModal";
import { useAuth } from "../context/AuthContext";
import { borrowBook } from "../services/borrowService";
import { deleteBook, fetchBooks, updateBook } from "../services/bookService";

const categoryOptions = ["all", "Comedy", "Fantasy", "action", "adventure", "sc-fi"];

function BookCatalog() {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadBooks = async (targetPage = page) => {
    try {
      const data = await fetchBooks({
        page: targetPage,
        limit: 6,
        search,
        ...(category !== "all" ? { category } : {})
      });
      setBooks(data.items);
      setPagination(data.pagination);
      setError("");
    } catch (loadError) {
      setError(loadError.message);
    }
  };

  useEffect(() => {
    loadBooks(page);
  }, [page, category]);

  const handleSearch = async (event) => {
    event.preventDefault();
    setPage(1);
    await loadBooks(1);
  };

  const handleBorrow = async (bookId) => {
    try {
      await borrowBook({ bookId });
      setMessage("Book borrowed successfully.");
      await loadBooks(page);
    } catch (borrowError) {
      setError(borrowError.message);
    }
  };

  const handleDelete = async (bookId) => {
    try {
      await deleteBook(bookId);
      setMessage("Book deleted successfully.");
      await loadBooks(page);
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  const handleEdit = (book) => {
    setCurrentBook(book);
    setShowModal(true);
  };

  const handleSaveBook = async (payload) => {
    setSaving(true);
    try {
      await updateBook(currentBook._id, payload);
      setMessage("Book updated successfully.");
      setShowModal(false);
      setCurrentBook(null);
      await loadBooks(page);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <div className="hero-panel mb-4 mb-lg-5">
        <div>
          <span className="eyebrow">Library Operations</span>
          <h1 className="display-title">Search, discover, and borrow from a live catalog</h1>
          <p className="lead-copy">
            All students and administrators can view the available book catalog. Students can borrow books,
            while administrators manage inventory and registrations.
          </p>
        </div>
        <div className="stats-chip">
          <strong>{pagination?.total ?? 0}</strong>
          <span>books tracked</span>
        </div>
      </div>

      <Form className="catalog-toolbar mb-4" onSubmit={handleSearch}>
        <Form.Control
          placeholder="Search by title or author"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Form.Select value={category} onChange={(event) => {
          setCategory(event.target.value);
          setPage(1);
        }}>
          {categoryOptions.map((option) => (
            <option key={option} value={option}>
              {option === "all" ? "All Categories" : option}
            </option>
          ))}
        </Form.Select>
        <Button type="submit" variant="warning">
          Search
        </Button>
      </Form>

      <AlertMessage>{error}</AlertMessage>
      <AlertMessage variant="success">{message}</AlertMessage>

      <BookCategorySections
        books={books}
        canBorrow={user?.role === "student"}
        onBorrow={handleBorrow}
        onEdit={user?.role === "admin" ? handleEdit : undefined}
        onDelete={user?.role === "admin" ? handleDelete : undefined}
        emptyMessage="No books found for the selected category or search."
      />

      {pagination && (
        <div className="d-flex justify-content-between align-items-center mt-4">
          <span>
            Page {pagination.page} of {pagination.pages || 1}
          </span>
          <div className="d-flex gap-2">
            <Button
              variant="outline-dark"
              disabled={pagination.page <= 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline-dark"
              disabled={pagination.page >= pagination.pages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <BookFormModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setCurrentBook(null);
        }}
        currentBook={currentBook}
        onSubmit={handleSaveBook}
        loading={saving}
      />
    </section>
  );
}

export default BookCatalog;
