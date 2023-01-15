import { motion } from 'framer-motion';
import { ChangeEvent, useState } from 'react';
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { AccidentalSign } from '../theory-utils/accidental';
import { LetterChar } from '../theory-utils/letters';
import { Note } from '../theory-utils/notes';
import { ScaleName } from '../theory-utils/scales';
import { getScaleFormUrlParams } from '../utils/url';
import Piano from './Piano';

const allScaleNames: ScaleName[] = [
    'Major',
    'Natural Minor',
    'Harmonic Minor',
    'Melodic Minor',
    'Major Pentatonic',
    'Minor Pentatonic',
];

export function Scale() {
    const urlParams = useParams<{ scale: string }>();
    const activeScale = getScaleFormUrlParams(urlParams.scale!);
    const [useFlat, setUseFlat] = useState(
        activeScale.tonic.accidental.sign === 'b'
    );
    const navigate = useNavigate();

    function handleUseFlatChange(e: ChangeEvent<HTMLInputElement>) {
        const checked = e.target.checked;
        setUseFlat(checked);
        if (activeScale.tonic.accidental.sign !== '') {
            const letters: LetterChar[][] = [
                ['C', 'D'],
                ['D', 'E'],
                ['F', 'G'],
                ['G', 'A'],
                ['A', 'B'],
            ];
            const newLetter = letters.filter(
                (x) => x[checked ? 0 : 1] === activeScale.tonic.letter.char
            )[0][checked ? 1 : 0];
            navigate(
                '/scales/' +
                    encodeURIComponent(
                        new Note(newLetter, checked ? 'b' : '#').format() +
                            ' ' +
                            activeScale.name
                    )
            );
        }
    }

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
                                useFlats={useFlat}
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
                    <div className="d-flex">
                        <h6 className="me-3">{activeScale.format()}</h6>
                        <Form.Check
                            type="switch"
                            label="Use flats (b)"
                            className="mb-1"
                            checked={useFlat}
                            onChange={handleUseFlatChange}
                        />
                    </div>
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
                        {activeScale.notes.some((x) =>
                            (['##', 'bb'] as AccidentalSign[]).includes(
                                x.accidental.sign
                            )
                        ) && (
                            <Alert variant="danger">
                                This is theoretical key because its key
                                signature have at least one double-flat (bb) or
                                double-sharp (##).
                            </Alert>
                        )}

                        <Piano highlightedNotes={activeScale.notes} />

                        <div className="d-flex mb-3">
                            {activeScale.notes.map((note, index) => {
                                return (
                                    <Card
                                        key={
                                            activeScale.format() +
                                            note.format(true)
                                        }
                                        className="flex-even"
                                    >
                                        <Card.Header className="text-center">
                                            {index + 1}
                                        </Card.Header>
                                        <Card.Body className="text-center fw-bold text-truncate px-0">
                                            {note.format(false)}
                                        </Card.Body>
                                    </Card>
                                );
                            })}
                        </div>
                        {activeScale.chords.length > 0 && (
                            <>
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
                            </>
                        )}
                    </motion.div>
                </Col>
            </Row>
        </>
    );
}
