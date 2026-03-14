import { useEffect, useState } from "react";
import { Button, Card, Col, Row, Table } from "react-bootstrap";
import AlertMessage from "../components/AlertMessage";
import BookCategorySections from "../components/BookCategorySections";
import BookFormModal from "../components/BookFormModal";
import {
  fetchAdminBorrowedBooks,
  fetchStudents,
  returnBook,
  reviewStudent
} from "../services/borrowService";
import {
  createBook,
  deleteBook,
  fetchBooks,
  updateBook
} from "../services/bookService";

function AdminDashboard() {
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      const [bookData, studentData, recordData] = await Promise.all([
        fetchBooks({ page: 1, limit: 12 }),
        fetchStudents(),
        fetchAdminBorrowedBooks()
      ]);
      setBooks(bookData.items);
      setStudents(studentData);
      setRecords(recordData);
      setError("");
    } catch (loadError) {
      setError(loadError.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveBook = async (payload) => {
    setSaving(true);
    try {
      if (currentBook?._id) {
        await updateBook(currentBook._id, payload);
        setMessage("Book updated successfully.");
      } else {
        await createBook(payload);
        setMessage("Book created successfully.");
      }
      setShowModal(false);
      setCurrentBook(null);
      await loadData();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      await deleteBook(id);
      setMessage("Book deleted successfully.");
      await loadData();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  const handleDecision = async (id, status) => {
    try {
      await reviewStudent(id, status);
      setMessage(`Student ${status} successfully.`);
      await loadData();
    } catch (decisionError) {
      setError(decisionError.message);
    }
  };

  const handleReturn = async (recordId) => {
    try {
      const data = await returnBook({ recordId });
      setMessage(`Book returned. Fine due: Rs. ${data.fineAmount}`);
      await loadData();
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap mb-4">
        <div>
          <span className="eyebrow">Administrator Control</span>
          <h1 className="display-title">Inventory, approvals, and borrow tracking</h1>
        </div>
        <Button
          variant="warning"
          onClick={() => {
            setCurrentBook(null);
            setShowModal(true);
          }}
        >
          Add Book
        </Button>
      </div>

      <AlertMessage>{error}</AlertMessage>
      <AlertMessage variant="success">{message}</AlertMessage>

      <Row className="g-4 mb-4">
        <Col lg={4}>
          <Card className="info-card h-100">
            <Card.Body>
              <h2>{books.length}</h2>
              <p>Books in current page</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="info-card h-100">
            <Card.Body>
              <h2>{students.filter((student) => student.status === "pending").length}</h2>
              <p>Pending approvals</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="info-card h-100">
            <Card.Body>
              <h2>{records.filter((record) => record.status !== "returned").length}</h2>
              <p>Active borrow records</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="mb-5">
        <h3 className="mb-3">Book inventory</h3>
        <BookCategorySections
          books={books}
          onEdit={(selectedBook) => {
            setCurrentBook(selectedBook);
            setShowModal(true);
          }}
          onDelete={handleDeleteBook}
          emptyMessage="No books are available in any category yet."
        />
      </div>

      <Row className="g-4">
        <Col xl={6}>
          <Card className="dashboard-card h-100">
            <Card.Body>
              <h3 className="mb-3">Student registrations</h3>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td className="text-capitalize">{student.status}</td>
                      <td className="d-flex gap-2">
                        <Button
                          size="sm"
                          variant="outline-success"
                          onClick={() => handleDecision(student._id, "approved")}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => handleDecision(student._id, "rejected")}
                        >
                          Reject
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <Card className="dashboard-card h-100">
            <Card.Body>
              <h3 className="mb-3">Borrow tracking</h3>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Student</th>
                    <th>Status</th>
                    <th>Fine</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id}>
                      <td>{record.book?.title}</td>
                      <td>{record.student?.name}</td>
                      <td className="text-capitalize">{record.status}</td>
                      <td>Rs. {record.fineAmount}</td>
                      <td>
                        {record.status !== "returned" && (
                          <Button size="sm" variant="warning" onClick={() => handleReturn(record.id)}>
                            Return
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

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

export default AdminDashboard;
