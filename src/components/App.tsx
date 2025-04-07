import { Suspense } from 'react';
import { Container, Nav, Navbar, NavDropdown, NavLink } from 'react-bootstrap';
import { GiMusicalNotes } from 'react-icons/gi';
import { Link, Redirect, Route, Router, useLocation } from 'wouter';
import { DetectScaleByNotes } from './DetectScaleByNotes';
import { AboutMe } from './AboutMe';
import { Circle } from './Circle';
import { ScalesCatalog } from './ScalesCatalog';
import { NumberOfAccidentalsGame } from './games/NumberOfAccidentalsGame';
import { ReadingTrainerGame } from './games/ReadingTrainerGame';
import { ChordSequencer } from './chord-sequencer/ChordSequencer';
import Course from './course/Course';

function App() {
  const [location] = useLocation();
  return (
    <Router>
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
              href="/"
              className="d-flex align-items-center"
            >
              <GiMusicalNotes className="me-3" size="2rem" />
              <div className="lh-sm">
                <div>Music Theory</div>
                <div className="fs-6">Notes</div>
              </div>
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav>
                <Nav.Link href="/circle" active={location === '/circle'}>
                  Circle of fifths
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  href="/scales"
                  active={location.startsWith('/scales')}
                >
                  Scales
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  href="/detect-scale-by-notes"
                  active={location.startsWith('/detect-scale-by-notes')}
                >
                  Scale by notes
                </Nav.Link>
                <NavDropdown
                  title="Games"
                  id="games-nav-dropdown"
                  active={location.startsWith('/games')}
                >
                  <NavDropdown.Item
                    as={Link}
                    href="/games/number-of-accidentals"
                  >
                    Number of accidentals
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} href="/games/reading-trainer">
                    Reading trainer
                  </NavDropdown.Item>
                </NavDropdown>
                <Nav.Link
                  as={NavLink}
                  href="/chord-sequencer"
                  active={location.startsWith('/chord-sequencer')}
                >
                  Chord Sequencer
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  href="/course"
                  active={location.startsWith('/course')}
                  className="text-warning"
                >
                  Course
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  href="/about"
                  active={location.startsWith('/about')}
                >
                  About me
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Container>
          <Route path="/">
            <Redirect href="/circle" />
          </Route>

          <Route path="/detect-scale-by-notes">
            <DetectScaleByNotes />
          </Route>

          <Route path="/about">
            <AboutMe />
          </Route>

          <Route path="/circle">
            <Circle />
          </Route>

          {/* old redirect */}
          <Route path="/circle/:scale">
            <Redirect href="/circle" />
          </Route>

          <Route path="/scales">
            <ScalesCatalog />
          </Route>

          <Route path="/games/number-of-accidentals">
            <NumberOfAccidentalsGame />
          </Route>

          <Route path="/games/reading-trainer">
            <ReadingTrainerGame />
          </Route>

          <Route path="/course">
            <Course />
          </Route>
        </Container>

        <Route path="/chord-sequencer">
          <ChordSequencer />
        </Route>
      </Suspense>
    </Router>
  );
}

export default App;
