import { Row } from "react-bootstrap";
import BookCard from "./BookCard";

const categoryOrder = ["Comedy", "Fantasy", "action", "adventure", "sc-fi"];

function BookCategorySections({ books, canBorrow = false, onBorrow, onEdit, onDelete, emptyMessage }) {
  const groupedBooks = categoryOrder
    .map((category) => ({
      category,
      items: books.filter((book) => book.category === category)
    }))
    .filter((group) => group.items.length > 0);

  if (!groupedBooks.length) {
    return <p className="text-muted mb-0">{emptyMessage}</p>;
  }

  return groupedBooks.map((group) => (
    <section key={group.category} className="mb-4 mb-lg-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0 text-capitalize">{group.category}</h3>
        <span className="text-muted small">{group.items.length} books</span>
      </div>
      <Row xs={1} md={2} xl={3} className="g-4">
        {group.items.map((book) => (
          <BookCard
            key={book._id}
            book={book}
            canBorrow={canBorrow}
            onBorrow={onBorrow}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </Row>
    </section>
  ));
}

export default BookCategorySections;
