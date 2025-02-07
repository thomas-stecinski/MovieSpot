import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Navbar, Nav, Container, Button, Dropdown } from "react-bootstrap"; // Importation de Bootstrap

const Navigation = () => {
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const navigate = useNavigate();

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername(null);
    navigate("/login");
  };

  return (
    <Navbar bg="light" variant="light" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          MovieSpot
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          {/* Nav items centrés avec espace uniforme */}
          <Nav className="d-flex justify-content-center flex-grow-1">
            <Nav.Item className="ms-3">
              <Link to="/" className="nav-link text-dark">Films</Link>
            </Nav.Item>
            <Nav.Item className="ms-3">
              <Link to="/myreservation" className="nav-link text-dark">Réservations</Link>
            </Nav.Item>
          </Nav>

          {/* Utilisateur à droite */}
          {username ? (
            <Dropdown className="ms-auto">
              <Dropdown.Toggle variant="link" id="dropdown-custom-components" className="text-dark">
                {username}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => navigate("/myreservation")}>
                  Mes réservations
                </Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>Se déconnecter</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <>
              <Nav.Item className="ms-3">
                <Link to="/login" className="nav-link text-dark">Connexion</Link>
              </Nav.Item>
              <Nav.Item className="ms-3">
                <Link to="/register" className="nav-link text-dark">Inscription</Link>
              </Nav.Item>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
