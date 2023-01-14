import { Suspense } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { GiMusicalNotes } from 'react-icons/gi';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

function App() {
    const location = useLocation();
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Navbar bg="dark" expand="lg" variant="dark" className="mb-3">
                <Container className="flex-nowrap">
                    <Navbar.Brand as={Link} to="/" className="text-truncate">
                        <GiMusicalNotes className="me-3" size="2rem" />
                        Music Theory Cheat Sheet
                    </Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav>
                            <Nav.Link
                                as={NavLink}
                                to="/circle/C"
                                active={location.pathname.startsWith('/circle')}
                            >
                                Circle of fifths
                            </Nav.Link>
                            <Nav.Link as={NavLink} to="/detect-scale-by-notes">
                                Determine scale
                            </Nav.Link>
                            <Nav.Link as={NavLink} to="/discography">
                                About me
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container>
                <Outlet />
            </Container>
        </Suspense>
    );
}

export default App;
