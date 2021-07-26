/* eslint-disable import/no-webpack-loader-syntax */
import AboutText from '!babel-loader!@mdx-js/loader!./AboutText.mdx';
import _ from 'lodash';
import React, { useState } from 'react';
import { Button, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import { BsQuestionCircle } from 'react-icons/bs';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { Note } from '../../theory-utils/note/Note';
import { MajorScale } from '../../theory-utils/scales/MajorScale';
import { NaturalMinorScale } from '../../theory-utils/scales/NaturalMinorScale';
import { Scale } from '../../theory-utils/scales/Scale';
import { getChordsByScale } from '../../theory-utils/utils/getChordsByScale';
import { getLetterIndices } from '../../theory-utils/utils/getLetterIndices';
import { isLetter } from '../../theory-utils/utils/isLetter';
import { isSymbol } from '../../theory-utils/utils/isSymbol';
import { getKeysUrl } from '../../utils/url';
import Piano from '../Piano';
import styles from './KeysInfo.module.scss';

const allKeys: Scale[] = [
    new MajorScale(Note.fromString('C')),
    new MajorScale(Note.fromString('G')),
    new MajorScale(Note.fromString('D')),
    new MajorScale(Note.fromString('A')),
    new MajorScale(Note.fromString('E')),
    new MajorScale(Note.fromString('B')),
    new MajorScale(Note.fromString('Gb')),
    new MajorScale(Note.fromString('Db')),
    new MajorScale(Note.fromString('Ab')),
    new MajorScale(Note.fromString('Eb')),
    new MajorScale(Note.fromString('Bb')),
    new MajorScale(Note.fromString('F')),
    new NaturalMinorScale(Note.fromString('A')),
    new NaturalMinorScale(Note.fromString('E')),
    new NaturalMinorScale(Note.fromString('B')),
    new NaturalMinorScale(Note.fromString('F#')),
    new NaturalMinorScale(Note.fromString('C#')),
    new NaturalMinorScale(Note.fromString('G#')),
    new NaturalMinorScale(Note.fromString('Eb')),
    new NaturalMinorScale(Note.fromString('Bb')),
    new NaturalMinorScale(Note.fromString('F')),
    new NaturalMinorScale(Note.fromString('C')),
    new NaturalMinorScale(Note.fromString('G')),
    new NaturalMinorScale(Note.fromString('D')),
];

const majorKeys = allKeys.filter((x) => x instanceof MajorScale);

const minorKeys = allKeys.filter((x) => x instanceof NaturalMinorScale);

const getTopKeyForButton = (key: Scale): Scale | undefined => {
    if (key.equals(new MajorScale(Note.fromString('Gb')))) {
        return new MajorScale(Note.fromString('F#'));
    }
    if (key.equals(new MajorScale(Note.fromString('Db')))) {
        return new MajorScale(Note.fromString('C#'));
    }
    if (key.equals(new NaturalMinorScale(Note.fromString('Eb')))) {
        return new NaturalMinorScale(Note.fromString('D#'));
    }
    if (key.equals(new NaturalMinorScale(Note.fromString('Bb')))) {
        return new NaturalMinorScale(Note.fromString('A#'));
    }
};

const getBottomKeyForButton = (key: Scale): Scale | undefined => {
    if (key.equals(new MajorScale(Note.fromString('B')))) {
        return new MajorScale(Note.fromString('Cb'));
    }
    if (key.equals(new NaturalMinorScale(Note.fromString('G#')))) {
        return new NaturalMinorScale(Note.fromString('Ab'));
    }
};

const minorRomanNumerals = ['i', 'iidim', 'III', 'iv', 'v', 'VI', 'VII'];

const majorRomanNumerals = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii'];

//allKeys ordered by letter like c, d, e, ... , b and then by symbol (none, flat, sharp) for select
const allKeysForSelect = _.orderBy(allKeys, [
    (x) => getLetterIndices().find((li) => li.letter === x.tonic.letter)!.index,
    (x) => (x.tonic.symbol === 'None' ? 0 : x.tonic.symbol === 'Flat' ? 1 : 2),
]);

function getActiveKeyFromUrlParams(params: { tonic?: string; scale?: string }) {
    if (!params.tonic) {
        return null;
    }

    const tonicLetter = params.tonic[0];

    if (!isLetter(tonicLetter)) {
        return null;
    }

    const tonicSymbol =
        params.tonic.length > 1 ? params.tonic.substring(2) : 'None';

    if (!isSymbol(tonicSymbol)) {
        return null;
    }

    const tonicNote = new Note(tonicLetter, tonicSymbol);

    const activeKeyFromUrl =
        params.scale === 'm'
            ? new NaturalMinorScale(tonicNote)
            : new MajorScale(tonicNote);

    return activeKeyFromUrl;
}

export const KeysInfo = () => {
    const [showHelp, setShowHelp] = useState(false);

    const history = useHistory();

    //get key from url
    const activeKeyFromUrl = getActiveKeyFromUrlParams(
        useParams<{ tonic?: string; scale?: string }>()
    );

    //find key in keys list
    const activeKey = activeKeyFromUrl
        ? allKeysForSelect.find((x) => x.equals(activeKeyFromUrl))
        : null;

    //redirect to c major if key is not supported
    if (!activeKey) {
        return <Redirect to={getKeysUrl(allKeys[0])} />;
    }

    const formatKeys = (keys: Scale[]) => {
        return keys.map((key, idx) => (
            <Button
                className={styles.key + ' rounded-circle'}
                key={idx}
                size="sm"
                variant="info"
                // onClick={() => setActiveKey(key)}
                onClick={() => history.push(getKeysUrl(key))}
                active={key === activeKey}
            >
                {!!getTopKeyForButton(key) && (
                    <div>{getTopKeyForButton(key)!.format()}</div>
                )}
                <div>{key.format()}</div>
                {!!getBottomKeyForButton(key) && (
                    <div>{getBottomKeyForButton(key)!.format()}</div>
                )}
            </Button>
        ));
    };

    const notesInKey = activeKey.getNotes();

    return (
        <>
            <div className="d-flex align-items-center">
                <h1 className="display-4">Тональности</h1>
                <Button variant="link" onClick={() => setShowHelp(true)}>
                    <BsQuestionCircle size="1.5rem" />
                </Button>
            </div>
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
                            value={allKeysForSelect
                                .indexOf(activeKey)
                                .toString()}
                            onChange={(e) => {
                                history.push(
                                    getKeysUrl(
                                        allKeysForSelect[
                                            parseInt(e.target.value)
                                        ]
                                    )
                                );
                            }}
                        >
                            {allKeysForSelect.map((key, idx) => (
                                <option key={idx} value={idx}>
                                    {key.format('long')}
                                </option>
                            ))}
                        </Form.Control>
                    </div>
                    <div className={styles.circleOfFifths}>
                        <div
                            className={styles.circle + ' ' + styles.majorCircle}
                        >
                            {formatKeys(majorKeys)}
                            <div
                                className={
                                    styles.circle + ' ' + styles.minorCircle
                                }
                            >
                                {formatKeys(minorKeys)}
                            </div>
                        </div>
                    </div>
                </Col>
                <Col xs={12} md={6}>
                    <h3>Ноты на клавиатуре</h3>
                    <p>Ноты выбранной тональности на клавиатуре.</p>
                    <Piano
                        highlightedNotes={notesInKey}
                        startOctave={activeKey == null ? 0 : undefined}
                        endOctave={activeKey == null ? 1 : undefined}
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
                                {notesInKey.map((note, idx) => (
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
                                {(activeKey instanceof MajorScale
                                    ? majorRomanNumerals
                                    : minorRomanNumerals
                                ).map((x, idx) => (
                                    <th key={idx}>{x}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="text-center">
                                {getChordsByScale(activeKey)!.map(
                                    (chords, colIdx) => (
                                        <td key={colIdx}>
                                            {chords.map((chord, rowIdx) => (
                                                <div
                                                    className="mb-2"
                                                    key={rowIdx}
                                                >
                                                    {notesInKey[
                                                        colIdx
                                                    ].format()}
                                                    {chord.getShortName()}
                                                </div>
                                            ))}
                                        </td>
                                    )
                                )}
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
                    <AboutText />
                </Modal.Body>
            </Modal>
        </>
    );
};
