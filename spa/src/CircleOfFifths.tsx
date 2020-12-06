import React from 'react';
import {
    Button,
    ButtonGroup,
    Col,
    OverlayTrigger,
    Popover,
    Row,
    Table,
    ToggleButton,
} from 'react-bootstrap';
import styles from './CircleOfFifths.module.scss';
import Piano from './Piano';
import { Note } from './theory-utils/Note';
import { notesByIntervals } from './theory-utils/notesByIntervals';
import { naturalMajor, naturalMinor } from './theory-utils/scales';

const parseNote = (parse: string) => {
    let note: Note = {
        letter: 'C',
        symbol: 'None',
        octave: 0,
    };
    switch (parse[0].toUpperCase()) {
        case 'C':
            note.letter = 'C';
            break;
        case 'D':
            note.letter = 'D';
            break;
        case 'E':
            note.letter = 'E';
            break;
        case 'F':
            note.letter = 'F';
            break;
        case 'G':
            note.letter = 'G';
            break;
        case 'A':
            note.letter = 'A';
            break;
        case 'B':
            note.letter = 'B';
            break;
        default:
            throw new Error();
    }
    if (parse.length > 1) {
        switch (parse[1]) {
            case '#':
                note.symbol = 'Sharp';
                break;
            case 'b':
                note.symbol = 'Flat';
                break;
            default:
                break;
        }
    }
    return note;
};

const formatNote = (note: Note) => {
    let result: string = note.letter;
    switch (note.symbol) {
        case 'Sharp':
            result += '#';
            break;
        case 'Flat':
            result += 'b';
            break;
        default:
            break;
    }
    return result;
};

const majorKeys: Note[][] = [
    [parseNote('C')],
    [parseNote('G')],
    [parseNote('D')],
    [parseNote('A')],
    [parseNote('E')],
    [parseNote('B'), parseNote('Cb')],
    [parseNote('F#'), parseNote('Gb')],
    [parseNote('C#'), parseNote('Db')],
    [parseNote('Ab')],
    [parseNote('Eb')],
    [parseNote('Bb')],
    [parseNote('F')],
];

const minorKeys: Note[][] = [
    [parseNote('A')],
    [parseNote('E')],
    [parseNote('B')],
    [parseNote('F#')],
    [parseNote('C#')],
    [parseNote('G#'), parseNote('Ab')],
    [parseNote('D#'), parseNote('Eb')],
    [parseNote('A#'), parseNote('Bb')],
    [parseNote('F')],
    [parseNote('C')],
    [parseNote('G')],
    [parseNote('D')],
];

type Mode = 'minor' | 'major';
type Key = {
    tonic: Note;
    mode: Mode;
};

const CircleOfFifths = () => {
    const [activeKey, setActiveKey] = React.useState<Key | null>(null);

    const getKeyOverlay = (tonics: Note[], mode: Mode) => {
        return (
            <Popover
                id={tonics[0].letter + tonics[0].symbol + mode}
                className={tonics.length === 1 ? 'd-none' : ''}
            >
                <Popover.Content>
                    <ButtonGroup toggle>
                        {tonics.map((tonic, idx) => (
                            <ToggleButton
                                key={idx}
                                type="radio"
                                variant="outline-secondary"
                                value=""
                                size="sm"
                                checked={
                                    activeKey !== null &&
                                    activeKey.tonic === tonic
                                }
                                onClick={() => setActiveKey({ tonic, mode })}
                            >
                                {formatNote(tonic) +
                                    (mode === 'minor' ? 'm' : '')}
                            </ToggleButton>
                        ))}
                    </ButtonGroup>
                </Popover.Content>
            </Popover>
        );
    };

    const formatKeys = (keys: Note[][], mode: Mode) => {
        return keys.map((ks, idx) => (
            <OverlayTrigger
                trigger="click"
                placement="top"
                rootClose={true}
                overlay={getKeyOverlay(ks, mode)}
                key={idx}
            >
                <Button
                    className={styles.key + ' rounded-circle'}
                    size="sm"
                    variant="info"
                    onClick={() => {
                        //otherwise user should select key in overlay
                        if (ks.length === 1) {
                            setActiveKey({ tonic: ks[0], mode });
                        }
                    }}
                    active={
                        activeKey != null &&
                        (activeKey.tonic === ks[0] ||
                            activeKey.tonic === ks[1]) &&
                        activeKey.mode === mode
                    }
                >
                    {ks.map((k, idx) => (
                        <div key={idx}>
                            {formatNote(k) + (mode === 'minor' ? 'm' : '')}
                        </div>
                    ))}
                </Button>
            </OverlayTrigger>
        ));
    };

    return (
        <>
            <h1>Circle Of Fifths</h1>
            <Row>
                <Col xs={12} md={6}>
                    <h3>Click on the key to get more info</h3>
                    <div className={styles.circleOfFifths}>
                        <div
                            className={styles.circle + ' ' + styles.majorCircle}
                        >
                            {formatKeys(majorKeys, 'major')}
                            <div
                                className={
                                    styles.circle + ' ' + styles.minorCircle
                                }
                            >
                                {formatKeys(minorKeys, 'minor')}
                            </div>
                        </div>
                    </div>
                </Col>
                <Col xs={12} md={6}>
                    <h3>Notes on piano</h3>
                    <Piano
                        highlightedNotes={
                            activeKey != null
                                ? notesByIntervals(
                                      activeKey.tonic,
                                      activeKey.mode === 'major'
                                          ? naturalMajor.intervals
                                          : naturalMinor.intervals
                                  )
                                : []
                        }
                        className="mb-4"
                    />
                    {activeKey != null && (
                        <div>
                            <h3>Key</h3>
                            <div className="mb-4">
                                {formatNote(activeKey.tonic)}{' '}
                                {activeKey.mode === 'major' ? 'Major' : 'Minor'}
                            </div>
                            <h3>Notes</h3>
                            <Table bordered>
                                <thead>
                                    <tr className="bg-light text-center">
                                        {Array.from({ length: 8 }).map(
                                            (_, idx) => (
                                                <th
                                                    key={idx}
                                                    style={{
                                                        width: 100 / 8 + '%',
                                                    }}
                                                >
                                                    {idx + 1}
                                                </th>
                                            )
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="text-center">
                                        {notesByIntervals(
                                            activeKey.tonic,
                                            activeKey.mode === 'major'
                                                ? naturalMajor.intervals
                                                : naturalMinor.intervals
                                        ).map((note, idx) => (
                                            <td key={idx}>
                                                {formatNote(note)}
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Col>
            </Row>
        </>
    );
};

export default CircleOfFifths;
