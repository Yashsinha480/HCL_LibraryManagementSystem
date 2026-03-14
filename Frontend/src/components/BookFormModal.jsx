import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

const categoryOptions = ["Comedy", "Fantasy", "action", "adventure", "sc-fi"];

const initialState = {
  title: "",
  author: "",
  isbn: "",
  category: "Comedy",
  totalCopies: 1,
  availableCopies: 1
};

function BookFormModal({ show, onHide, onSubmit, currentBook, loading }) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    setForm(
      currentBook
        ? {
            ...currentBook,
            totalCopies: Number(currentBook.totalCopies),
            availableCopies: Number(currentBook.availableCopies)
          }
        : initialState
    );
  }, [currentBook, show]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: name.includes("Copies") ? Number(value) : value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{currentBook ? "Edit Book" : "Add Book"}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {["title", "author", "isbn"].map((field) => (
            <Form.Group key={field} className="mb-3">
              <Form.Label className="text-capitalize">{field}</Form.Label>
              <Form.Control
                name={field}
                value={form[field]}
                onChange={handleChange}
                required
              />
            </Form.Group>
          ))}
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="category"
              value={form.category}
              onChange={handleChange}
              disabled={Boolean(currentBook)}
              required
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Total Copies</Form.Label>
            <Form.Control
              type="number"
              min="1"
              name="totalCopies"
              value={form.totalCopies}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Available Copies</Form.Label>
            <Form.Control
              type="number"
              min="0"
              name="availableCopies"
              value={form.availableCopies}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button type="submit" variant="warning" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default BookFormModal;
