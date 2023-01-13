import _ from 'lodash';
import { useState } from 'react';
import { Button, Col, Modal, Row, Table } from 'react-bootstrap';
import { BsPlayCircle, BsQuestionCircle } from 'react-icons/bs';
import { useNavigate, useParams } from 'react-router-dom';
import { createPianoSynth } from '../../piano-synth';
import { Chord } from '../../theory-utils/chords/Chord';
import { MajorScale } from '../../theory-utils/scales/MajorScale';
import { NaturalMinorScale } from '../../theory-utils/scales/NaturalMinorScale';
import { Scale } from '../../theory-utils/scales/Scale';
import { isTouchDevice } from '../../utils/isTouchDevice';
import { getScaleFormUrlParams, getScaleUrl } from '../../utils/url';
import Piano from '../Piano';
import styles from './ScaleInfo.module.scss';

const pianoSynth = createPianoSynth();

const scalesInCircle: { scale: Scale; clickable: boolean }[][] = [
    [{ scale: MajorScale.create('C'), clickable: true }],
    [{ scale: MajorScale.create('G'), clickable: true }],
    [{ scale: MajorScale.create('D'), clickable: true }],
    [{ scale: MajorScale.create('A'), clickable: true }],
    [{ scale: MajorScale.create('E'), clickable: true }],
    [
        { scale: MajorScale.create('B'), clickable: true },
        { scale: MajorScale.create('Cb'), clickable: false },
    ],
    [
        { scale: MajorScale.create('F#'), clickable: false },
        { scale: MajorScale.create('Gb'), clickable: true },
    ],
    [
        { scale: MajorScale.create('C#'), clickable: false },
        { scale: MajorScale.create('Db'), clickable: true },
    ],
    [{ scale: MajorScale.create('Ab'), clickable: true }],
    [{ scale: MajorScale.create('Eb'), clickable: true }],
    [{ scale: MajorScale.create('Bb'), clickable: true }],
    [{ scale: MajorScale.create('F'), clickable: true }],
    [{ scale: NaturalMinorScale.create('A'), clickable: true }],
    [{ scale: NaturalMinorScale.create('E'), clickable: true }],
    [{ scale: NaturalMinorScale.create('B'), clickable: true }],
    [{ scale: NaturalMinorScale.create('F#'), clickable: true }],
    [{ scale: NaturalMinorScale.create('C#'), clickable: true }],
    [
        { scale: NaturalMinorScale.create('G#'), clickable: true },
        { scale: NaturalMinorScale.create('Ab'), clickable: false },
    ],
    [
        { scale: NaturalMinorScale.create('D#'), clickable: false },
        { scale: NaturalMinorScale.create('Eb'), clickable: true },
    ],
    [
        { scale: NaturalMinorScale.create('A#'), clickable: false },
        { scale: NaturalMinorScale.create('Bb'), clickable: true },
    ],
    [{ scale: NaturalMinorScale.create('F'), clickable: true }],
    [{ scale: NaturalMinorScale.create('C'), clickable: true }],
    [{ scale: NaturalMinorScale.create('G'), clickable: true }],
    [{ scale: NaturalMinorScale.create('D'), clickable: true }],
];

const clickableScales = scalesInCircle.map(
    (x) => x.filter((x) => x.clickable)[0].scale
);

export function ScaleInfo() {
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

    function formatCircleButtons(
        scalesInCircleButtons: { scale: Scale; clickable: boolean }[][]
    ) {
        return scalesInCircleButtons.map((circleItem, idx) => {
            return (
                <Button
                    className={styles.key}
                    key={idx}
                    variant={
                        circleItem
                            .filter((x) => x.clickable)[0]
                            .scale.format() === activeScale.format()
                            ? 'danger'
                            : _.intersection(
                                  _.flatten(activeScale.chords).map((x) =>
                                      x.format('short')
                                  ),
                                  circleItem.map((x) => x.scale.format('short'))
                              ).length > 0
                            ? 'secondary'
                            : 'light border border-2'
                    }
                    onClick={() =>
                        navigate(
                            getScaleUrl(
                                circleItem.filter((x) => x.clickable)[0].scale
                            )
                        )
                    }
                    active={
                        circleItem
                            .filter((x) => x.clickable)[0]
                            .scale.format() === activeScale.format()
                    }
                >
                    {circleItem.map((x, idx) => (
                        <div key={idx}>{x.scale.format()}</div>
                    ))}
                </Button>
            );
        });
    }

    function playChord(chord: Chord) {
        setPlayingChord(chord);
        chord
            .getNotes()
            .map((x) => x.format())
            .forEach((x) => {
                pianoSynth.triggerAttack(x);
            });
    }

    function stopChord(chord: Chord) {
        setPlayingChord(null);
        chord
            .getNotes()
            .map((x) => x.format())
            .forEach((x) => {
                pianoSynth.triggerRelease(x);
            });
    }

    return (
        <Row>
            <Col xs={12} md={6}>
                <h3 className="d-flex align-items-center">
                    Circle of fifths
                    <Button
                        variant="link"
                        className="p-0 ms-2"
                        onClick={() => setShowHelp(true)}
                    >
                        <BsQuestionCircle size="1.5rem" />
                    </Button>
                </h3>
                <div className="mb-2">
                    <p>
                        You can choose a key by clicking on the corresponding
                        button in the circle.
                    </p>
                </div>
                <div className={styles.circleOfFifths}>
                    <div className={styles.circle + ' ' + styles.majorCircle}>
                        {formatCircleButtons(scalesInCircle.slice(0, 12))}
                        <div
                            className={styles.circle + ' ' + styles.minorCircle}
                        >
                            {formatCircleButtons(scalesInCircle.slice(12, 24))}
                        </div>
                    </div>
                </div>
            </Col>
            <Col xs={12} md={6}>
                <h3>Keyboard notes</h3>
                <p>Notes of the selected key on the keyboard.</p>
                <Piano
                    highlightedNotes={activeScale.notes}
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
                            {activeScale.notes.map((note, idx) => (
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
                                : ['i', 'iidim', 'III', 'iv', 'v', 'VI', 'VII']
                            ).map((x, idx) => (
                                <th key={idx}>{x}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="text-center">
                            {activeScale.chords
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
        </Row>
    );
}