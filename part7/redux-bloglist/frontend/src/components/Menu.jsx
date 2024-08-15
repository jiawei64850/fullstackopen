import { Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
const Menu = ({ user, handleLogout }) => {
  const MenuStyle = {
    paddingright: 5,
    paddingLeft: 5,
    textDecoration: "none",
    color: "white"
  }

  return (
    <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link as="span">
            <Link style={MenuStyle} to="/">home</Link>
          </Nav.Link>
          <Nav.Link as="span">
            <Link style={MenuStyle} to="/blogs">blogs</Link>
          </Nav.Link>
          <Nav.Link as="span">
            <Link style={MenuStyle} to="/users">users</Link>
          </Nav.Link>
        </Nav>
        <Nav>
          <Navbar.Text className="me-3">
          {user.username} logged in
          </Navbar.Text>
          <button type="button" onClick={handleLogout} aria-label="logout" className="btn btn-outline-light">
            logout
          </button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}



export default Menu