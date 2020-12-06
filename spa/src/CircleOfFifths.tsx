import React from 'react';
import { Col, OverlayTrigger, Popover, Row } from 'react-bootstrap';
import styles from './CircleOfFifths.module.scss';
import { Letter, letters } from './theory-utils/Letter';
import { Note } from './theory-utils/Note';
import { notesByIntervals } from './theory-utils/notesByIntervals';
import { Scale } from './theory-utils/Scale';
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

const CircleOfFifths = () => {
    const overlay = (tonics: Note[], scale: 'major' | 'minor') => {
        return (
            <Popover id={tonics[0].letter + tonics[0].symbol}>
                <Popover.Content>
                    {tonics.map((tonic) => (
                        <div key={tonic.letter + tonic.symbol}>
                            <div className="font-weight-bold text-center">
                                {formatNote(tonic) +
                                    (scale === 'minor' ? 'm' : '')}
                            </div>
                            {notesByIntervals(
                                tonic,
                                scale === 'major'
                                    ? naturalMajor.intervals
                                    : naturalMinor.intervals
                            ).map((note, index) => (
                                <span key={index} className="mr-2">
                                    {formatNote(note)}
                                    <sup>{index + 1}</sup>
                                </span>
                            ))}
                        </div>
                    ))}
                </Popover.Content>
            </Popover>
        );
    };

    const formatKeys = (keys: Note[][], scale: 'major' | 'minor') => {
        return keys.map((ks) => (
            <OverlayTrigger
                trigger="click"
                placement="top"
                rootClose={true}
                overlay={overlay(ks, scale)}
                key={ks[0].letter + ks[0].symbol}
            >
                <div className={styles.key}>
                    {ks.map((k) => (
                        <div key={k.letter}>
                            {formatNote(k) + (scale === 'minor' ? 'm' : '')}
                        </div>
                    ))}
                </div>
            </OverlayTrigger>
        ));
    };

    return (
        <>
            <div className="d-flex justify-content-center mb-4">
                Click on key to get more info
            </div>
            <Row className="justify-content-center">
                <Col xs={12} md={6}>
                    <div className={styles.circle + ' ' + styles.majorCircle}>
                        {formatKeys(majorKeys, 'major')}
                        <div
                            className={styles.circle + ' ' + styles.minorCircle}
                        >
                            {formatKeys(minorKeys, 'minor')}
                        </div>
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default CircleOfFifths;
