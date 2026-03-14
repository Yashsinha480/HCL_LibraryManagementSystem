import { useEffect, useState } from "react";
import { Card, Col, Row, Table } from "react-bootstrap";
import AlertMessage from "../components/AlertMessage";
import BookCategorySections from "../components/BookCategorySections";
import {
  borrowBook,
  fetchStudentBorrowedBooks,
  fetchStudentDueBooks
} from "../services/borrowService";
import { fetchBooks } from "../services/bookService";

function StudentDashboard() {
  const [borrowed, setBorrowed] = useState([]);
  const [availableBooks, setAvailableBooks] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadData = async () => {
    try {
      const [borrowedData, bookData] = await Promise.all([
        fetchStudentBorrowedBooks(),
        fetchBooks({ page: 1, limit: 6 })
      ]);
      setBorrowed(borrowedData);
      setAvailableBooks(bookData.items);
      setError("");
    } catch (loadError) {
      setError(loadError.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBorrow = async (bookId) => {
    try {
      await borrowBook({ bookId });
      setMessage("Book borrowed successfully.");
      await loadData();
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  return (
    <section>
      <div className="section-head mb-4">
        <span className="eyebrow">Student Dashboard</span>
        <h1 className="display-title">Borrowing status, due dates, and fines</h1>
      </div>
      <AlertMessage>{error}</AlertMessage>
      <AlertMessage variant="success">{message}</AlertMessage>
      <Row className="g-4 mb-4">
        <Col md={6}>
          <Card className="info-card h-100">
            <Card.Body>
              <h2>{borrowed.length}</h2>
              <p>Borrow records</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="info-card h-100">
            <Card.Body>
              <h2>{borrowed.filter((item) => item.status === "returned").length}</h2>
              <p>Returned books</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Card className="dashboard-card">
        <Card.Body>
          <h3 className="mb-3">Borrowed books</h3>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Book</th>
                <th>Status</th>
                <th>Due date</th>
                <th>Fine</th>
              </tr>
            </thead>
            <tbody>
              {borrowed.map((record) => (
                <tr key={record.id}>
                  <td>{record.book?.title}</td>
                  <td className="text-capitalize">{record.status}</td>
                  <td>{new Date(record.dueDate).toLocaleDateString()}</td>
                  <td>Rs. {record.fineAmount}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <div className="mt-4 mt-lg-5">
        <div className="section-head mb-4">
          <span className="eyebrow">Available Books</span>
          <h2 className="display-title">Browse and borrow from the catalog</h2>
        </div>
        <BookCategorySections
          books={availableBooks}
          canBorrow
          onBorrow={handleBorrow}
          emptyMessage="No books are available in any category right now."
        />
      </div>
    </section>
  );
}

export default StudentDashboard;
