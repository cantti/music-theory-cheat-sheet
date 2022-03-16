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
import * as Tone from 'tone';
import { Chord } from '../../theory-utils/chords/Chord';

const synth = new Tone.PolySynth(Tone.Synth, {
    // envelope: {
    //     attack: 0.0001,
    //     decay: 0.3,
    // },
});

const filter = new Tone.Filter(1000, 'lowpass');

synth.chain(filter, Tone.Destination);

const scalesInCircle: { scale: Scale; clickable: boolean }[][] = [
    [{ scale: new MajorScale(new Note('C')), clickable: true }],
    [{ scale: new MajorScale(new Note('G')), clickable: true }],
    [{ scale: new MajorScale(new Note('D')), clickable: true }],
    [{ scale: new MajorScale(new Note('A')), clickable: true }],
    [{ scale: new MajorScale(new Note('E')), clickable: true }],
    [
        { scale: new MajorScale(new Note('B')), clickable: true },
        { scale: new MajorScale(new Note('C', 'Flat')), clickable: false },
    ],
    [
        { scale: new MajorScale(new Note('F', 'Sharp')), clickable: false },
        { scale: new MajorScale(new Note('G', 'Flat')), clickable: true },
    ],
    [
        { scale: new MajorScale(new Note('C', 'Sharp')), clickable: false },
        { scale: new MajorScale(new Note('D', 'Flat')), clickable: true },
    ],
    [{ scale: new MajorScale(new Note('A', 'Flat')), clickable: true }],
    [{ scale: new MajorScale(new Note('E', 'Flat')), clickable: true }],
    [{ scale: new MajorScale(new Note('B', 'Flat')), clickable: true }],
    [{ scale: new MajorScale(new Note('F')), clickable: true }],
    [{ scale: new NaturalMinorScale(new Note('A')), clickable: true }],
    [{ scale: new NaturalMinorScale(new Note('E')), clickable: true }],
    [{ scale: new NaturalMinorScale(new Note('B')), clickable: true }],
    [{ scale: new NaturalMinorScale(new Note('F', 'Sharp')), clickable: true }],
    [{ scale: new NaturalMinorScale(new Note('C', 'Sharp')), clickable: true }],
    [
        {
            scale: new NaturalMinorScale(new Note('G', 'Sharp')),
            clickable: true,
        },
        {
            scale: new NaturalMinorScale(new Note('A', 'Flat')),
            clickable: false,
        },
    ],
    [
        {
            scale: new NaturalMinorScale(new Note('D', 'Sharp')),
            clickable: false,
        },
        {
            scale: new NaturalMinorScale(new Note('E', 'Flat')),
            clickable: true,
        },
    ],
    [
        {
            scale: new NaturalMinorScale(new Note('A', 'Sharp')),
            clickable: false,
        },
        {
            scale: new NaturalMinorScale(new Note('B', 'Flat')),
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
    (x) => (x.tonic.symbol === 'None' ? 0 : x.tonic.symbol === 'Flat' ? 1 : 2),
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

    const play = (chord: Chord) => {
        synth.triggerAttackRelease(
            chord.getNotes().map((x) => x.format() + (x.octave + 4)),
            '16n'
        );
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
                                    <td key={idx}>{note.format()}</td>
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
                                            <div>{chord.format()}</div>
                                            <div>
                                                <BsPlayCircle
                                                    onClick={() => play(chord)}
                                                    role="button"
                                                />
                                            </div>
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
