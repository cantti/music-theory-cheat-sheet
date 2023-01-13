import { useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Note } from '../theory-utils/notes';
import { Scale } from '../theory-utils/scales/Scale';
import { getScalesByNotes } from '../theory-utils/utils/getScalesByNotes';
import { getScaleUrl } from '../utils/url';
import Piano from './Piano';

interface ScaleButtonProps {
    scale: Scale;
}

function ScaleButton({ scale }: ScaleButtonProps) {
    return (
        <Link to={getScaleUrl(scale)}>
            <Button
                variant={scale.shortName === 'm' ? 'info' : 'warning'}
                className="w-100 h-100 mb-2"
                size="lg"
            >
                {scale.format('long')}
            </Button>
        </Link>
    );
}

export function DetectScaleByNotes() {
    const [notes, setNotes] = useState<Note[]>([]);

    const possibleScales = getScalesByNotes(notes);

    return (
        <Row>
            <Col md={6} className="mb-3">
                <h3>Select notes</h3>
                <p>
                    Here you can determine the key by the notes. Press a key to
                    select it.
                </p>
                <Piano
                    startOctave={4}
                    endOctave={5}
                    highlightedNotes={notes}
                    onNoteClick={(note) =>
                        notes.some((n) => n.equals(note))
                            ? setNotes(notes.filter((n) => !n.equals(note)))
                            : setNotes([...notes, note])
                    }
                />
            </Col>
            <Col md={6}>
                <h3>Possible scales</h3>
                <p>Here is a list of possible scales.</p>
                <Row>
                    <Col>
                        <b>Major</b>
                        {possibleScales
                            .filter((x) => x.shortName !== 'm')
                            .map((scale, index) => (
                                <ScaleButton scale={scale} key={index} />
                            ))}
                    </Col>
                    <Col>
                        <b>Parallel minor</b>
                        {possibleScales
                            .filter((x) => x.shortName === 'm')
                            .map((scale, index) => (
                                <ScaleButton scale={scale} key={index} />
                            ))}
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}
