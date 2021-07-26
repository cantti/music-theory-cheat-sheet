import React, { Suspense } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { GiMusicalNotes } from 'react-icons/gi';
import {
    HashRouter as Router,
    Link,
    NavLink,
    Redirect,
    Route,
    Switch,
} from 'react-router-dom';
import './App.scss';
import { KeysInfo } from './KeysInfo';
import { AboutMe } from './AboutMe';
import { DetectScaleByNotes } from './DetectScaleByNotes';

const App = () => {
    return (
        <Router>
            <Suspense fallback={<div>Loading...</div>}>
                <Navbar bg="dark" expand="lg" variant="dark">
                    <Container>
                        <Navbar.Brand as={Link} to="/">
                            <GiMusicalNotes className="mr-3" size="2rem" />
                            Шпаргалка по теории музыки
                        </Navbar.Brand>
                        <Navbar.Toggle />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav>
                                <Nav.Link as={NavLink} to="/keys/C">
                                    Тональности
                                </Nav.Link>
                                <Nav.Link
                                    as={NavLink}
                                    to="/detect-scale-by-notes"
                                >
                                    Определить тональность
                                </Nav.Link>
                                <Nav.Link as={NavLink} to="/discography">
                                    Обо мне
                                </Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <Container>
                    <Switch>
                        <Route exact path="/">
                            <Redirect to="/keys/C" />
                        </Route>
                        <Route path="/detect-scale-by-notes">
                            <DetectScaleByNotes />
                        </Route>
                        <Route path="/discography">
                            <AboutMe />
                        </Route>
                        <Route path="/keys/:tonic/:scale?">
                            <KeysInfo />
                        </Route>
                    </Switch>
                </Container>
            </Suspense>
        </Router>
    );
};

export default App;
