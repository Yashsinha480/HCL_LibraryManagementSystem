function BookCard({ book, canBorrow, onBorrow, onEdit, onDelete }) {
  return (
    <div className="col">
      <article className="book-card h-100">
        <div className="d-flex justify-content-between align-items-start mb-3 gap-3">
          <span className="book-category">{book.category}</span>
          <span className={book.availableCopies > 0 ? "stock-open" : "stock-closed"}>
            {book.availableCopies > 0 ? "Available" : "Unavailable"}
          </span>
        </div>
        <h3>{book.title}</h3>
        <p className="book-author">{book.author}</p>
        <ul className="book-meta">
          <li>ISBN: {book.isbn}</li>
          <li>Total copies: {book.totalCopies}</li>
        </ul>
        <div className="d-flex gap-2 flex-wrap mt-auto">
          {canBorrow && (
            <button
              type="button"
              className="btn btn-warning"
              disabled={book.availableCopies < 1}
              onClick={() => onBorrow(book._id)}
            >
              Borrow
            </button>
          )}
          {onEdit && (
            <button type="button" className="btn btn-outline-dark" onClick={() => onEdit(book)}>
              Edit
            </button>
          )}
          {onDelete && (
            <button type="button" className="btn btn-outline-danger" onClick={() => onDelete(book._id)}>
              Delete
            </button>
          )}
        </div>
      </article>
    </div>
  );
}

export default BookCard;
