import { useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import AlertMessage from "../components/AlertMessage";
import { registerRequest } from "../services/authService";

function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await registerRequest(form);
      setForm({ name: "", email: "", password: "", role: "student" });
      setSuccess("Student registration submitted. An approved administrator must activate the account before login.");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row className="justify-content-center">
      <Col lg={7}>
        <Card className="auth-card">
          <Card.Body className="p-4 p-lg-5">
            <span className="eyebrow">Account Onboarding</span>
            <h1 className="display-title mb-3">Register student account</h1>
            <p className="auth-subtitle">Create a student account for borrowing and due-date tracking.</p>
            <AlertMessage>{error}</AlertMessage>
            <AlertMessage variant="success">{success}</AlertMessage>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control name="name" value={form.name} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <input type="hidden" name="role" value={form.role} />
              <Button type="submit" variant="warning" disabled={loading}>
                {loading ? "Submitting..." : "Register"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default RegisterPage;
