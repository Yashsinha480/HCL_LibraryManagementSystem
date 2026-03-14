import { useEffect, useState } from "react";
import { Button, ButtonGroup, Card, Col, Form, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import AlertMessage from "../components/AlertMessage";
import { useAuth } from "../context/AuthContext";

function LoginPage({ initialRole = "student", allowRoleSwitch = true }) {
  const [role, setRole] = useState(initialRole);
  const [form, setForm] = useState({ email: "", password: "", role: initialRole });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setRole(initialRole);
    setForm({ email: "", password: "", role: initialRole });
    setError("");
  }, [initialRole]);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleRoleChange = (nextRole) => {
    if (!allowRoleSwitch) {
      return;
    }

    setRole(nextRole);
    setForm((prev) => ({ ...prev, role: nextRole }));
    setError("");
  };

  const getSafeRedirect = (userRole) => {
    const requestedPath = location.state?.from;
    const defaultPath = userRole === "admin" ? "/admin" : "/student";

    if (!requestedPath) {
      return defaultPath;
    }

    if (requestedPath.startsWith("/admin")) {
      return userRole === "admin" ? requestedPath : defaultPath;
    }

    if (requestedPath.startsWith("/student")) {
      return userRole === "student" ? requestedPath : defaultPath;
    }

    return requestedPath;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const session = await login(form);
      navigate(getSafeRedirect(session.user.role), { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row className="justify-content-center">
      <Col lg={6}>
        <Card className="auth-card">
          <Card.Body className="p-4 p-lg-5">
            <span className="eyebrow">Secure Access</span>
            <h1 className="display-title mb-3">Login to your library workspace</h1>
            {allowRoleSwitch && (
              <ButtonGroup className="auth-switch mb-4">
                <Button
                  variant={role === "student" ? "warning" : "outline-dark"}
                  onClick={() => handleRoleChange("student")}
                >
                  Student Login
                </Button>
                <Button
                  variant={role === "admin" ? "warning" : "outline-dark"}
                  onClick={() => handleRoleChange("admin")}
                >
                  Administrator Login
                </Button>
              </ButtonGroup>
            )}
            <p className="auth-subtitle">
              {role === "student"
                ? "Students can sign in to borrow, return, and track due books."
                : "Administrators can sign in to manage inventory and approve registrations."}
            </p>
            <AlertMessage>{error}</AlertMessage>
            <Form onSubmit={handleSubmit}>
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
                {loading ? "Signing in..." : "Login"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default LoginPage;
