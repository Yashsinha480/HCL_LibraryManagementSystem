import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AppNavbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar expand="lg" className="site-nav sticky-top">
      <Container>
        <Navbar.Brand as={Link} to="/catalog" className="brand-mark">
          HCL Library
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto align-items-lg-center gap-lg-3">
            <Nav.Link as={NavLink} to="/catalog">
              Catalog
            </Nav.Link>
            {!isAuthenticated && (
              <>
                <Nav.Link as={NavLink} to="/register">
                  Register
                </Nav.Link>
                <Nav.Link as={NavLink} to="/login/student">
                  Student Login
                </Nav.Link>
                <Nav.Link as={NavLink} to="/login/admin">
                  Admin Login
                </Nav.Link>
              </>
            )}
            {isAuthenticated && user?.role === "student" && (
              <Nav.Link as={NavLink} to="/student">
                Student Dashboard
              </Nav.Link>
            )}
            {isAuthenticated && user?.role === "admin" && (
              <Nav.Link as={NavLink} to="/admin">
                Admin Dashboard
              </Nav.Link>
            )}
            {isAuthenticated && (
              <button type="button" className="btn btn-sm btn-light" onClick={handleLogout}>
                Logout
              </button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
