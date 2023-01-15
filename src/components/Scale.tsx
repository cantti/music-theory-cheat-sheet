import { motion } from 'framer-motion';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { ScaleName } from '../theory-utils/scales';
import { getScaleFormUrlParams } from '../utils/url';
import Piano from './Piano';

const allScaleNames: ScaleName[] = [
    'Major',
    'Natural Minor',
    'Harmonic Minor',
    'Melodic Minor',
];

export function Scale() {
    const urlParams = useParams<{ scale: string }>();
    const activeScale = getScaleFormUrlParams(urlParams.scale!);
    const navigate = useNavigate();

    return (
        <>
            <h3>Scale info</h3>
            <Row>
                <Col md={6}>
                    <p>Select root note and scale name</p>
                    <Row>
                        <Col>
                            <Piano
                                highlightedNotes={[activeScale.tonic]}
                                onNoteClick={(note) =>
                                    navigate(
                                        '/scales/' +
                                            encodeURIComponent(
                                                note.format() +
                                                    ' ' +
                                                    activeScale.name
                                            )
                                    )
                                }
                            />
                        </Col>
                        <Col>
                            {allScaleNames.map((scaleName) => (
                                <Button
                                    key={scaleName}
                                    className="w-100 mb-1"
                                    variant={
                                        scaleName.includes('Minor')
                                            ? 'info'
                                            : 'warning'
                                    }
                                    disabled={activeScale.name === scaleName}
                                    onClick={() =>
                                        navigate(
                                            '/scales/' +
                                                encodeURIComponent(
                                                    activeScale.tonic.format() +
                                                        ' ' +
                                                        scaleName
                                                )
                                        )
                                    }
                                >
                                    {scaleName}
                                </Button>
                            ))}
                        </Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <motion.div
                        key={activeScale.format()}
                        initial={{ rotateY: 180 }}
                        animate={{ rotateY: 0 }}
                        transition={{
                            duration: 0.3,
                        }}
                    >
                        <p>Notes in scale</p>
                        <Piano highlightedNotes={activeScale.notes} />

                        <p>The main chords of the selected key.</p>
                        <div className="d-flex mb-3">
                            {activeScale.chords.map((chord, index) => (
                                <Card key={index} className="flex-even">
                                    <Card.Header className="text-center text-truncate">
                                        {index + 1}
                                    </Card.Header>
                                    <Card.Body className="text-center fw-bold text-truncate px-0">
                                        {chord[0].format('short')}
                                    </Card.Body>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                </Col>
            </Row>
        </>
    );
}
