/* eslint-disable import/no-webpack-loader-syntax */
import _ from 'lodash';
import React, { useState } from 'react';
import { Button, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import { BsQuestionCircle, BsPlayCircle } from 'react-icons/bs';
import { Note } from '../../theory-utils/note/Note';
import { MajorScale } from '../../theory-utils/scales/MajorScale';
import { NaturalMinorScale } from '../../theory-utils/scales/NaturalMinorScale';
import { Scale } from '../../theory-utils/scales/Scale';
import { getChordsByScale } from '../../theory-utils/utils/getChordsByScale';
import { getLetterIndices } from '../../theory-utils/utils/getLetterIndices';
import { getScaleFormUrlParams, getScaleUrl } from '../../utils/url';
import Piano from '../Piano';
import styles from './ScaleInfo.module.scss';
import { Chord } from '../../theory-utils/chords/Chord';
import { createPianoSynth } from '../../piano-synth';
import { isTouchDevice } from '../../utils/isTouchDevice';
import { useNavigate, useParams } from 'react-router-dom';

const pianoSynth = createPianoSynth();

const scalesInCircle: { scale: Scale; clickable: boolean }[][] = [
    [{ scale: new MajorScale(new Note('C')), clickable: true }],
    [{ scale: new MajorScale(new Note('G')), clickable: true }],
    [{ scale: new MajorScale(new Note('D')), clickable: true }],
    [{ scale: new MajorScale(new Note('A')), clickable: true }],
    [{ scale: new MajorScale(new Note('E')), clickable: true }],
    [
        { scale: new MajorScale(new Note('B')), clickable: true },
        { scale: new MajorScale(new Note('C', 'b')), clickable: false },
    ],
    [
        { scale: new MajorScale(new Note('F', '#')), clickable: false },
        { scale: new MajorScale(new Note('G', 'b')), clickable: true },
    ],
    [
        { scale: new MajorScale(new Note('C', '#')), clickable: false },
        { scale: new MajorScale(new Note('D', 'b')), clickable: true },
    ],
    [{ scale: new MajorScale(new Note('A', 'b')), clickable: true }],
    [{ scale: new MajorScale(new Note('E', 'b')), clickable: true }],
    [{ scale: new MajorScale(new Note('B', 'b')), clickable: true }],
    [{ scale: new MajorScale(new Note('F')), clickable: true }],
    [{ scale: new NaturalMinorScale(new Note('A')), clickable: true }],
    [{ scale: new NaturalMinorScale(new Note('E')), clickable: true }],
    [{ scale: new NaturalMinorScale(new Note('B')), clickable: true }],
    [{ scale: new NaturalMinorScale(new Note('F', '#')), clickable: true }],
    [{ scale: new NaturalMinorScale(new Note('C', '#')), clickable: true }],
    [
        {
            scale: new NaturalMinorScale(new Note('G', '#')),
            clickable: true,
        },
        {
            scale: new NaturalMinorScale(new Note('A', 'b')),
            clickable: false,
        },
    ],
    [
        {
            scale: new NaturalMinorScale(new Note('D', '#')),
            clickable: false,
        },
        {
            scale: new NaturalMinorScale(new Note('E', 'b')),
            clickable: true,
        },
    ],
    [
        {
            scale: new NaturalMinorScale(new Note('A', '#')),
            clickable: false,
        },
        {
            scale: new NaturalMinorScale(new Note('B', 'b')),
            clickable: true,
        },
    ],
    [{ scale: new NaturalMinorScale(new Note('F')), clickable: true }],
    [{ scale: new NaturalMinorScale(new Note('C')), clickable: true }],
    [{ scale: new NaturalMinorScale(new Note('G')), clickable: true }],
    [{ scale: new NaturalMinorScale(new Note('D')), clickable: true }],
];

const clickableScales = scalesInCircle.map(
    (x) => x.filter((x) => x.clickable)[0].scale
);

// clickableScales ordered by letter like c, d, e, ... , b and then by symbol (none, flat, sharp) for select
const clickableScalesSorted = _.orderBy(clickableScales, [
    (x) => getLetterIndices().find((li) => li.letter === x.tonic.letter)!.index,
    (x) => (x.tonic.symbol === '' ? 0 : x.tonic.symbol === 'b' ? 1 : 2),
]);

export const ScaleInfo = () => {
    const [showHelp, setShowHelp] = useState(false);

    const [playingChord, setPlayingChord] = useState<Chord | null>(null);

    const navigate = useNavigate();

    const urlParams = useParams<{ scale: string }>();

    //get scale from url
    const activeScale = getScaleFormUrlParams(urlParams.scale!);

    //redirect to c major if scale is not supported
    if (!activeScale) {
        navigate(getScaleUrl(clickableScales[0]));
        return null;
    }

    const formatCircleButtons = (
        scalesInCircleButtons: { scale: Scale; clickable: boolean }[][]
    ) => {
        return scalesInCircleButtons.map((circleItem, idx) => (
            <Button
                className={styles.key + ' rounded-circle'}
                key={idx}
                size="sm"
                variant="info"
                onClick={() =>
                    navigate(
                        getScaleUrl(
                            circleItem.filter((x) => x.clickable)[0].scale
                        )
                    )
                }
                active={
                    circleItem.filter((x) => x.clickable)[0].scale.format() ===
                    activeScale.format()
                }
            >
                {circleItem.map((x, idx) => (
                    <div key={idx}>{x.scale.format()}</div>
                ))}
            </Button>
        ));
    };

    const notesInScale = activeScale.getNotes();

    const playChord = (chord: Chord) => {
        setPlayingChord(chord);
        chord
            .getNotes()
            .map((x) => x.format())
            .forEach((x) => {
                pianoSynth.triggerAttack(x);
            });
    };

    const stopChord = (chord: Chord) => {
        setPlayingChord(null);
        chord
            .getNotes()
            .map((x) => x.format())
            .forEach((x) => {
                pianoSynth.triggerRelease(x);
            });
    };

    return (
        <>
            <h1 className="d-flex flex-wrap align-items-center display-4">
                <div className="mr-2">Keys</div>
                <Button
                    variant="link"
                    className="p-0"
                    onClick={() => setShowHelp(true)}
                >
                    <BsQuestionCircle size="1.5rem" />
                </Button>
            </h1>
            <Row>
                <Col xs={12} md={6}>
                    <h3>Circle of fifths</h3>
                    <div className="mb-2">
                        <p>
                            You can choose a key from the list below or clicking
                            on the corresponding button in the circle.
                        </p>
                        <Form.Control
                            as="select"
                            custom
                            value={clickableScalesSorted.findIndex(
                                (x) => x.format() === activeScale.format()
                            )}
                            onChange={(e) => {
                                navigate(
                                    getScaleUrl(
                                        clickableScalesSorted[
                                            parseInt(e.target.value)
                                        ]
                                    )
                                );
                            }}
                        >
                            {clickableScalesSorted.map((scale, idx) => (
                                <option key={idx} value={idx}>
                                    {scale.format('long')}
                                </option>
                            ))}
                        </Form.Control>
                    </div>
                    <div className={styles.circleOfFifths}>
                        <div
                            className={styles.circle + ' ' + styles.majorCircle}
                        >
                            {formatCircleButtons(scalesInCircle.slice(0, 12))}
                            <div
                                className={
                                    styles.circle + ' ' + styles.minorCircle
                                }
                            >
                                {formatCircleButtons(
                                    scalesInCircle.slice(12, 24)
                                )}
                            </div>
                        </div>
                    </div>
                </Col>
                <Col xs={12} md={6}>
                    <h3>Keyboard notes</h3>
                    <p>Notes of the selected key on the keyboard.</p>
                    <Piano
                        highlightedNotes={notesInScale}
                        startOctave={activeScale == null ? 0 : undefined}
                        endOctave={activeScale == null ? 1 : undefined}
                        className="mb-4"
                    />

                    <h3>Notes</h3>
                    <p>Notes of the selected key, starting with the tonic.</p>
                    <Table bordered responsive>
                        <thead>
                            <tr className="bg-light text-center">
                                {Array.from({ length: 8 }).map((_, idx) => (
                                    <th key={idx}>{idx + 1}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="text-center">
                                {notesInScale.map((note, idx) => (
                                    <td key={idx}>{note.format(false)}</td>
                                ))}
                            </tr>
                        </tbody>
                    </Table>

                    <h3>Chords</h3>
                    <p>The main chords of the selected key.</p>
                    <Table bordered responsive>
                        <thead>
                            <tr className="bg-light text-center">
                                {(activeScale instanceof MajorScale
                                    ? ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii']
                                    : [
                                          'i',
                                          'iidim',
                                          'III',
                                          'iv',
                                          'v',
                                          'VI',
                                          'VII',
                                      ]
                                ).map((x, idx) => (
                                    <th key={idx}>{x}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="text-center">
                                {getChordsByScale(activeScale)!
                                    .map((x) => x[0])
                                    .map((chord, colIdx) => (
                                        <td key={colIdx}>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="w-100"
                                                onMouseDown={(e) => {
                                                    e.stopPropagation();
                                                    if (isTouchDevice()) return;
                                                    playChord(chord);
                                                }}
                                                onMouseUp={(e) => {
                                                    e.stopPropagation();
                                                    if (isTouchDevice()) return;
                                                    stopChord(chord);
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.stopPropagation();
                                                    if (isTouchDevice()) return;
                                                    if (e.buttons === 1) {
                                                        stopChord(chord);
                                                    }
                                                }}
                                                onTouchStart={(e) => {
                                                    e.stopPropagation();
                                                    playChord(chord);
                                                }}
                                                onTouchEnd={(e) => {
                                                    e.stopPropagation();
                                                    stopChord(chord);
                                                }}
                                            >
                                                {chord.format()}
                                                <br />
                                                <BsPlayCircle />
                                            </Button>
                                        </td>
                                    ))}
                            </tr>
                        </tbody>
                    </Table>
                    <p>Notes of the playing chord.</p>
                    <Piano
                        highlightedNotes={
                            playingChord != null ? playingChord.getNotes() : []
                        }
                        startOctave={4}
                        endOctave={5}
                    />
                </Col>
            </Row>
            <Modal show={showHelp} onHide={() => setShowHelp(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Help</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    On this page you can get detailed information about any key.
                    For convenience, all keys are indicated on the interactive
                    quarto-quint circle. The circle of fifths is a way of
                    depicting major and minor keys. On the outer side of the
                    circle are major keys, on the inner side are parallel minor
                    ones. The note following the tonic clockwise on the circle
                    is the dominant. And the subdominant is the next note on the
                    circle counterclockwise.
                </Modal.Body>
            </Modal>
        </>
    );
};
