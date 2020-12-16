import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { GiMusicalNotes } from "react-icons/gi";
import {
    BrowserRouter as Router,
    NavLink,
    Route,
    Switch,
} from "react-router-dom";
import "./App.scss";
import CircleOfFifths from "./CircleOfFifths";
import DiscographyList from "./DiscographyList";

const App = () => {
    return (
        <Router>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand href="#home">
                        <GiMusicalNotes className="mr-3" />
                        Music Theory Helpers
                    </Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav>
                            <Nav.Link as={NavLink} to="/circle">
                                Circle Of Fifths
                            </Nav.Link>
                            <Nav.Link as={NavLink} to="/scales">
                                Scales
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
                        Home
                    </Route>
                    <Route path="/discography">
                        <DiscographyList />
                    </Route>
                    <Route path="/scales">scales</Route>
                    <Route path="/circle">
                        <CircleOfFifths />
                    </Route>
                </Switch>
            </Container>
        </Router>
    );
};

export default App;
