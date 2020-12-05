import React from 'react';
import './App.css';
import { notesByInterval } from './theory-utils';
import { naturalMajor } from './theory-utils/scales';
import Piano from './Piano';
import './App.scss';
import {
    Navbar,
    Nav,
    NavDropdown,
    Card,
    Carousel,
    Container,
} from 'react-bootstrap';
import { BsMusicNoteBeamed } from 'react-icons/bs';
import DiscographyList from './DiscographyList';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    NavLink,
} from 'react-router-dom';

const App = () => {
    return (
        <Router>
            <Container className="text-light">
                <div className="display-2 text-light text-center">
                    Cantti's Dub Music
                </div>
                <Navbar
                    bg="dark"
                    variant="dark"
                    className="justify-content-center mb-3"
                >
                    <Nav>
                        <Nav.Link as={NavLink} to="/about">
                            About
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/discography">
                            Discography
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/scales">
                            Scales
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/circle">
                        circle
                        </Nav.Link>
                    </Nav>
                </Navbar>
                <Switch>
                    <Route exact path="/">
                        Home
                    </Route>
                    <Route path="/discography">
                        <DiscographyList />
                    </Route>
                    <Route path="/scales">scales</Route>
                    <Route path="/circle">circle</Route>
                </Switch>
            </Container>
        </Router>
    );
};

export default App;
