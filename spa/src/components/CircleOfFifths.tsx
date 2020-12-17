import _ from "lodash";
import React from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import { getChordsByScale } from "../theory-utils/chords";
import { formatNote } from "../theory-utils/formatNote";
import { notesByIntervals } from "../theory-utils/notesByIntervals";
import { parseNote } from "../theory-utils/parseNote";
import { ScaleName } from "../theory-utils/scales";
import { getScale } from "../theory-utils/scales/";
import { ConcreteScale } from "../theory-utils/types/ConcreteScale";
import { Note } from "../theory-utils/types/Note";
import styles from "./CircleOfFifths.module.scss";
import Piano from "./Piano";

const majorKeys: Note[][] = [
    [parseNote("C")],
    [parseNote("G")],
    [parseNote("D")],
    [parseNote("A")],
    [parseNote("E")],
    [parseNote("B"), parseNote("Cb")],
    [parseNote("F#"), parseNote("Gb")],
    [parseNote("C#"), parseNote("Db")],
    [parseNote("Ab")],
    [parseNote("Eb")],
    [parseNote("Bb")],
    [parseNote("F")],
];

const minorKeys: Note[][] = [
    [parseNote("A")],
    [parseNote("E")],
    [parseNote("B")],
    [parseNote("F#")],
    [parseNote("C#")],
    [parseNote("G#"), parseNote("Ab")],
    [parseNote("D#"), parseNote("Eb")],
    [parseNote("A#"), parseNote("Bb")],
    [parseNote("F")],
    [parseNote("C")],
    [parseNote("G")],
    [parseNote("D")],
];

const minorRomanNumerals = ["i", "iidim", "III", "iv", "v", "VI", "VII"];

const majorRomanNumerals = ["I", "ii", "iii", "IV", "V", "vi", "vii"];

const CircleOfFifths = () => {
    const [activeKey, setActiveKey] = React.useState<ConcreteScale>({
        tonic: parseNote("C"),
        scaleName: "major",
    });

    const formatKeys = (keys: Note[][], scaleName: ScaleName) => {
        return keys.map((ks, idx) => (
            <Button
                className={styles.key + " rounded-circle"}
                key={idx}
                size="sm"
                variant="info"
                onClick={() =>
                    setActiveKey({
                        tonic:
                            ks.length === 1 ||
                            _.isEqual(ks[0], parseNote("G#")) ||
                            _.isEqual(ks[0], parseNote("B"))
                                ? ks[0]
                                : ks[1],
                        scaleName,
                    })
                }
                active={
                    (_.isEqual(activeKey.tonic, ks[0]) ||
                        _.isEqual(activeKey.tonic, ks[1])) &&
                    activeKey.scaleName === scaleName
                }
            >
                {ks.map((k, idx) => (
                    <div key={idx}>
                        {formatNote(k) +
                            (scaleName === "naturalMinor" ? "m" : "")}
                    </div>
                ))}
            </Button>
        ));
    };

    const notesInKey = notesByIntervals(
        activeKey.tonic,
        getScale(activeKey.scaleName).intervals
    );

    return (
        <>
            <h1>Circle Of Fifths</h1>
            <Row>
                <Col xs={12} md={6}>
                    <div className="mb-2">
                        Click on the key to get more info.
                    </div>
                    <div className={styles.circleOfFifths}>
                        <div
                            className={styles.circle + " " + styles.majorCircle}
                        >
                            {formatKeys(majorKeys, "major")}
                            <div
                                className={
                                    styles.circle + " " + styles.minorCircle
                                }
                            >
                                {formatKeys(minorKeys, "naturalMinor")}
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

                    <div>
                        <h3>Key</h3>
                        <div className="mb-4">
                            {`${formatNote(activeKey.tonic)} ${
                                activeKey.scaleName === "major"
                                    ? "Major"
                                    : "Minor"
                            }`}
                        </div>

                        <h3>Notes</h3>
                        <Table bordered style={{ tableLayout: "fixed" }}>
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

                        <h3>Chords</h3>
                        <Table bordered style={{ tableLayout: "fixed" }}>
                            <thead>
                                <tr className="bg-light text-center">
                                    {(activeKey.scaleName === "major"
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
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default CircleOfFifths;
