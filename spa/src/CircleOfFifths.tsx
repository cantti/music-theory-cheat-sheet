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
import { Letter, letters } from './theory-utils/Letter';
import { Note } from './theory-utils/Note';
import { notesByIntervals } from './theory-utils/notesByIntervals';
import { Scale } from './theory-utils/Scale';
import { naturalMajor, naturalMinor } from './theory-utils/scales';
import { CSSTransition } from 'react-transition-group';

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
    const [clickedKey, setClickedKey] = React.useState<Note | null>(null);

    const overlay = (tonics: Note[], mode: Mode) => {
        return (
            <Popover
                id={tonics[0].letter + tonics[0].symbol}
                className={tonics.length === 1 ? 'd-none' : ''}
            >
                <Popover.Content>
                    <ButtonGroup toggle>
                        {tonics.map((tonic, idx) => (
                            <ToggleButton
                                key={idx}
                                type="radio"
                                variant="outline-secondary"
                                value={''}
                                checked={
                                    activeKey !== null &&
                                    activeKey.tonic === tonic
                                }
                                onClick={() => handleKeyClick({ tonic, mode })}
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

    const handleKeyClick = (key: Key) => {
        setActiveKey(key);
    };

    const formatKeys = (keys: Note[][], mode: Mode) => {
        return keys.map((ks, idx) => (
            <CSSTransition
                in={clickedKey === ks[0]}
                timeout={40}
                onEntered={() => setClickedKey(null)}
                classNames={{
                    enter: styles.keyClickEnter,
                    enterActive: styles.keyClickEnterActive,
                    exit: styles.keyClickExit,
                    exitActive: styles.keyClickEnterActive,
                }}
            >
                <OverlayTrigger
                    trigger="click"
                    placement="top"
                    rootClose={true}
                    overlay={overlay(ks, mode)}
                    key={ks[0].letter + ks[0].symbol}
                >
                    <div
                        className={
                            styles.key +
                            ' ' +
                            (activeKey != null &&
                            (activeKey.tonic === ks[0] ||
                                activeKey.tonic === ks[1]) &&
                            activeKey.mode === mode
                                ? styles.active
                                : '')
                        }
                        onClick={() => {
                            if (ks.length === 1) {
                                handleKeyClick({ tonic: ks[0], mode });
                            }
                            setClickedKey(ks[0]);
                        }}
                    >
                        {ks.map((k) => (
                            <div key={k.letter}>
                                {formatNote(k) + (mode === 'minor' ? 'm' : '')}
                            </div>
                        ))}
                    </div>
                </OverlayTrigger>
            </CSSTransition>
        ));
    };

    return (
        <>
            <Row>
                <Col xs={12} md={6}>
                    <h2>Click on key to get more info</h2>

                    <div className={styles.circle + ' ' + styles.majorCircle}>
                        {formatKeys(majorKeys, 'major')}
                        <div
                            className={styles.circle + ' ' + styles.minorCircle}
                        >
                            {formatKeys(minorKeys, 'minor')}
                        </div>
                    </div>
                </Col>
                <Col xs={12} lg={6}>
                    <h2>Notes on piano</h2>
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
                            <h2>Key</h2>
                            <div className="mb-4">
                                {activeKey.tonic.letter}{' '}
                                {activeKey.mode === 'major' ? 'Major' : 'Minor'}
                            </div>
                            <h2>Notes</h2>
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
