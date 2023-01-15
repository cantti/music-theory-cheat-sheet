import { Suspense } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { GiMusicalNotes } from 'react-icons/gi';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

function App() {
    const location = useLocation();
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Navbar
                bg="dark"
                expand="lg"
                sticky="top"
                variant="dark"
                className="py-1 mb-3"
            >
                <Container>
                    <Navbar.Brand
                        as={Link}
                        to="/"
                        className="d-flex align-items-center"
                    >
                        <GiMusicalNotes className="me-3" size="2rem" />
                        <div className="lh-sm">
                            <div>Music Theory</div>
                            <div className="fs-6">Cheat Sheet</div>
                        </div>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav>
                            <Nav.Link
                                as={NavLink}
                                to="/circle/C Major"
                                active={location.pathname.startsWith('/circle')}
                            >
                                Circle of fifths
                            </Nav.Link>
                            <Nav.Link
                                as={NavLink}
                                to="/scales/C Major"
                                active={location.pathname.startsWith('/scales')}
                            >
                                Scales
                            </Nav.Link>
                            <Nav.Link as={NavLink} to="/detect-scale-by-notes">
                                Scale by note
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
