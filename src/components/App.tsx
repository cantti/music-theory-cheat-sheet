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
import { ScaleInfo } from './ScaleInfo';
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
                            Music Theory Cheat Sheet
                        </Navbar.Brand>
                        <Navbar.Toggle />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav>
                                <Nav.Link as={NavLink} to="/keys">
                                    Circle of fifths
                                </Nav.Link>
                                <Nav.Link
                                    as={NavLink}
                                    to="/detect-scale-by-notes"
                                >
                                    Detect scale
                                </Nav.Link>
                                <Nav.Link as={NavLink} to="/discography">
                                    About me
                                </Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <Container>
                    <Switch>
                        <Route exact path="/">
                            <Redirect to="/keys" />
                        </Route>
                        <Route path="/detect-scale-by-notes">
                            <DetectScaleByNotes />
                        </Route>
                        <Route path="/discography">
                            <AboutMe />
                        </Route>
                        <Route path="/keys/:tonic?/:scale?">
                            <ScaleInfo />
                        </Route>
                    </Switch>
                </Container>
            </Suspense>
        </Router>
    );
};

export default App;
