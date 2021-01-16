import _ from 'lodash';
import React from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import Markdown from 'react-markdown';
import { getChordsByScale } from '../theory-utils/chords';
import { formatNote } from '../theory-utils/formatNote';
import { notesByIntervals } from '../theory-utils/notesByIntervals';
import { parseNote } from '../theory-utils/parseNote';
import { getScale } from '../theory-utils/scales';
import { ConcreteScale } from '../theory-utils/types/ConcreteScale';
import styles from './CircleOfFifths.module.scss';
import Piano from './Piano';

const allKeys: ConcreteScale[] = [
    { tonic: parseNote('C'), scaleName: 'major' },
    { tonic: parseNote('G'), scaleName: 'major' },
    { tonic: parseNote('D'), scaleName: 'major' },
    { tonic: parseNote('A'), scaleName: 'major' },
    { tonic: parseNote('E'), scaleName: 'major' },
    { tonic: parseNote('B'), scaleName: 'major' },
    { tonic: parseNote('Gb'), scaleName: 'major' },
    { tonic: parseNote('Db'), scaleName: 'major' },
    { tonic: parseNote('Ab'), scaleName: 'major' },
    { tonic: parseNote('Eb'), scaleName: 'major' },
    { tonic: parseNote('Bb'), scaleName: 'major' },
    { tonic: parseNote('F'), scaleName: 'major' },
    { tonic: parseNote('A'), scaleName: 'naturalMinor' },
    { tonic: parseNote('E'), scaleName: 'naturalMinor' },
    { tonic: parseNote('B'), scaleName: 'naturalMinor' },
    { tonic: parseNote('F#'), scaleName: 'naturalMinor' },
    { tonic: parseNote('C#'), scaleName: 'naturalMinor' },
    { tonic: parseNote('G#'), scaleName: 'naturalMinor' },
    { tonic: parseNote('Eb'), scaleName: 'naturalMinor' },
    { tonic: parseNote('Bb'), scaleName: 'naturalMinor' },
    { tonic: parseNote('F'), scaleName: 'naturalMinor' },
    { tonic: parseNote('C'), scaleName: 'naturalMinor' },
    { tonic: parseNote('G'), scaleName: 'naturalMinor' },
    { tonic: parseNote('D'), scaleName: 'naturalMinor' },
];

const majorKeys = allKeys.filter((x) => x.scaleName === 'major');

const minorKeys = allKeys.filter((x) => x.scaleName === 'naturalMinor');

const keysEqual = (key1: ConcreteScale, key2: ConcreteScale) => {
    return _.isEqual(key1, key2);
};

const formatKey = (key: ConcreteScale) => {
    return (
        formatNote(key.tonic) + (key.scaleName === 'naturalMinor' ? 'm' : '')
    );
};

const getTopKey = (key: ConcreteScale): ConcreteScale | undefined => {
    if (
        keysEqual(key, {
            tonic: parseNote('Gb'),
            scaleName: 'major',
        })
    ) {
        return {
            tonic: parseNote('F#'),
            scaleName: 'major',
        };
    }
    if (
        keysEqual(key, {
            tonic: parseNote('Db'),
            scaleName: 'major',
        })
    ) {
        return {
            tonic: parseNote('C#'),
            scaleName: 'major',
        };
    }
    if (
        keysEqual(key, {
            tonic: parseNote('Eb'),
            scaleName: 'naturalMinor',
        })
    ) {
        return {
            tonic: parseNote('D#'),
            scaleName: 'naturalMinor',
        };
    }
    if (
        keysEqual(key, {
            tonic: parseNote('Bb'),
            scaleName: 'naturalMinor',
        })
    ) {
        return {
            tonic: parseNote('A#'),
            scaleName: 'naturalMinor',
        };
    }
};

const getBottomKey = (key: ConcreteScale): ConcreteScale | undefined => {
    if (
        keysEqual(key, {
            tonic: parseNote('B'),
            scaleName: 'major',
        })
    ) {
        return {
            tonic: parseNote('Cb'),
            scaleName: 'major',
        };
    }
    if (
        keysEqual(key, {
            tonic: parseNote('G#'),
            scaleName: 'naturalMinor',
        })
    ) {
        return {
            tonic: parseNote('Ab'),
            scaleName: 'naturalMinor',
        };
    }
};

const minorRomanNumerals = ['i', 'iidim', 'III', 'iv', 'v', 'VI', 'VII'];

const majorRomanNumerals = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii'];

const articleMd = `На этой странице вы можете получить подробную информацию о любой тональности. Для удобства все тональности указаны на интерактивном кварто-квинтовом круге.

**Кварто-квинтовый круг** — это способ изображения мажорных и минорных тональностей. На внешней стороны круга — **мажорные** тональности, на внутренней — **минорные**. Притом минорные тональности на круге являются **параллельными** мажорным. Следующая за тоникой по часовой стрелке нота на круге — **доминанта**. А **субдоминанта** — следующая нота на круге против часовой стрелки.

Кварто-квинтовый круг помогает понять какие аккорды присутствуют тональности, а также какие аккорды можно заимствовать из других тональностей. Например, тональность До мажор (C Major) и Соль мажор (G Major) имеют 4 общих аккорда (C, G, D, Am, Em, Bm). Значит в тональности до мажор, можно попробовать использовать заимствованные из Соль мажор аккорды D и Bm. Существуют и другие способы заимствования аккордов с помощью кварто-квинтового круга.`;

const KeysInfo = () => {
    const [activeKey, setActiveKey] = React.useState<ConcreteScale>(allKeys[0]);

    const [activeKeyIndex, setActiveKeyIndex] = React.useState(
        allKeys.indexOf(activeKey).toString()
    );

    const formatKeys = (keys: ConcreteScale[]) => {
        return keys.map((key, idx) => (
            <Button
                className={styles.key + ' rounded-circle'}
                key={idx}
                size="sm"
                variant="info"
                onClick={() => {
                    setActiveKey(key);
                    setActiveKeyIndex(allKeys.indexOf(key).toString());
                }}
                active={key === activeKey}
            >
                {!!getTopKey(key) && <div>{formatKey(getTopKey(key)!)}</div>}
                <div>{formatKey(key)}</div>
                {!!getBottomKey(key) && (
                    <div>{formatKey(getBottomKey(key)!)}</div>
                )}
            </Button>
        ));
    };

    const notesInKey = notesByIntervals(
        activeKey.tonic,
        getScale(activeKey.scaleName).intervals
    );

    return (
        <>
            <h1 className="display-4">Тональности</h1>
            <Row>
                <Col xs={12} md={6}>
                    <h3>О чем это все</h3>
                    <Markdown>{articleMd}</Markdown>
                </Col>
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
                            value={activeKeyIndex}
                            onChange={(e) => {
                                setActiveKeyIndex(e.target.value);
                                setActiveKey(allKeys[parseInt(e.target.value)]);
                            }}
                        >
                            {allKeys.map((key, idx) => (
                                <option key={idx} value={idx}>
                                    {formatKey(key)}
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
                    <h3>Notes on piano</h3>
                    <Piano
                        highlightedNotes={notesInKey}
                        startOctave={activeKey == null ? 0 : undefined}
                        endOctave={activeKey == null ? 1 : undefined}
                        className="mb-4"
                    />
                </Col>
                <Col xs={12} md={6}>
                    <h3>Notes</h3>
                    <Table bordered style={{ tableLayout: 'fixed' }}>
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
                                    <td key={idx}>{formatNote(note)}</td>
                                ))}
                            </tr>
                        </tbody>
                    </Table>
                </Col>
                <Col xs={12} md={6}>
                    <h3>Chords</h3>
                    <Table bordered style={{ tableLayout: 'fixed' }}>
                        <thead>
                            <tr className="bg-light text-center">
                                {(activeKey.scaleName === 'major'
                                    ? majorRomanNumerals
                                    : minorRomanNumerals
                                ).map((x, idx) => (
                                    <th key={idx}>{x}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="text-center">
                                {getChordsByScale(activeKey.scaleName).map(
                                    (chords, colIdx) => (
                                        <td key={colIdx}>
                                            {chords.map((chord, rowIdx) => (
                                                <div
                                                    className="mb-2"
                                                    key={rowIdx}
                                                >
                                                    {formatNote(
                                                        notesInKey[colIdx]
                                                    )}
                                                    {chord.shortName}
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
        </>
    );
};

export default KeysInfo;
