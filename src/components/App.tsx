import { Suspense } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { GiMusicalNotes } from 'react-icons/gi';
import {
    Link,
    NavLink,
    Outlet,
} from 'react-router-dom';
import './App.scss';

const App = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Navbar bg="dark" expand="lg" variant="dark">
                <Container>
                    <Navbar.Brand as={Link} to="/">
                        <GiMusicalNotes className="mr-3" size="2rem" />
                        Music Theory Cheat Sheet
                    </Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav>
                            <Nav.Link as={NavLink} to="/keys">
                                Circle of fifths
                            </Nav.Link>
                            <Nav.Link as={NavLink} to="/detect-scale-by-notes">
                                Detect scale
                            </Nav.Link>
                            <Nav.Link as={NavLink} to="/discography">
                                About me
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container className="pb-2">
                <Outlet />
            </Container>
        </Suspense>
    );
};

export default App;
