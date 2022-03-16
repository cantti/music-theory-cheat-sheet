/* eslint-disable import/no-webpack-loader-syntax */
import _ from 'lodash';
import React, { useState } from 'react';
import { Button, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import { BsQuestionCircle, BsPlayCircle } from 'react-icons/bs';
import { Redirect, useHistory, useParams } from 'react-router-dom';
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

    const history = useHistory();

    const urlParams = useParams<{ tonic?: string; scale?: string }>();

    //get scale from url
    const activeScale = getScaleFormUrlParams(urlParams.tonic, urlParams.scale);

    //redirect to c major if scale is not supported
    if (!activeScale) {
        return <Redirect to={getScaleUrl(clickableScales[0])} />;
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
                    history.push(
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

    const handleChordPlayMouseDown = (chord: Chord) => {
        chord
            .getNotes()
            .map((x) => x.format())
            .forEach((x) => {
                pianoSynth.triggerAttack(x);
            });
    };

    const handleChordPlayMouseUp = (chord: Chord) => {
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
                <div className="mr-2">Тональности</div>
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
                    <h3>Кварто-квинтовый круг</h3>
                    <div className="mb-2">
                        <p>
                            Вы можете выбрать тональность из списка ниже или
                            нажав на соответствующую кнопку в круге.
                        </p>
                        <Form.Control
                            as="select"
                            custom
                            value={clickableScalesSorted.findIndex(
                                (x) => x.format() === activeScale.format()
                            )}
                            onChange={(e) => {
                                history.push(
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
                    <h3>Ноты на клавиатуре</h3>
                    <p>Ноты выбранной тональности на клавиатуре.</p>
                    <Piano
                        highlightedNotes={notesInScale}
                        startOctave={activeScale == null ? 0 : undefined}
                        endOctave={activeScale == null ? 1 : undefined}
                        className="mb-4"
                    />

                    <h3>Ноты</h3>
                    <p>Ноты выбранной тональности, начиная с тоники.</p>
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

                    <h3>Аккорды</h3>
                    <p>Основные аккорды выбранной тональности.</p>
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
                                                onMouseDown={() =>
                                                    handleChordPlayMouseDown(
                                                        chord
                                                    )
                                                }
                                                onMouseUp={() =>
                                                    handleChordPlayMouseUp(
                                                        chord
                                                    )
                                                }
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
                </Col>
            </Row>
            <Modal show={showHelp} onHide={() => setShowHelp(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Справка о тональностях</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    На этой странице вы можете получить подробную информацию о
                    любой тональности. Для удобства все тональности указаны на
                    интерактивном кварто-квинтовом круге. Кварто-квинтовый круг
                    — это способ изображения мажорных и минорных тональностей.
                    На внешней стороне круга — мажорные тональности, на
                    внутренней — параллельные минорные. Следующая за тоникой по
                    часовой стрелке нота на круге — доминанта. А субдоминанта —
                    следующая нота на круге против часовой стрелки.
                </Modal.Body>
            </Modal>
        </>
    );
};
