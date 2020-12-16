import deepEqual from "deep-equal";
import React from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import { formatNote } from "../theory-utils/formatNote";
import { Note } from "../theory-utils/types/Note";
import { notesByIntervals } from "../theory-utils/notesByIntervals";
import { parseNote } from "../theory-utils/parseNote";
import { naturalMajor } from "../theory-utils/scales/naturalMajor";
import { naturalMinor } from "../theory-utils/scales/naturalMinor";
import styles from "./CircleOfFifths.module.scss";
import Piano from "./Piano";

type Mode = "minor" | "major";

type Key = {
    tonic: Note;
    mode: Mode;
};

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

const CircleOfFifths = () => {
    const [activeKey, setActiveKey] = React.useState<Key | null>(null);

    const formatKeys = (keys: Note[][], mode: Mode) => {
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
                            deepEqual(ks[0], parseNote("G#")) ||
                            deepEqual(ks[0], parseNote("B"))
                                ? ks[0]
                                : ks[1],
                        mode,
                    })
                }
                active={
                    activeKey != null &&
                    (activeKey.tonic === ks[0] || activeKey.tonic === ks[1]) &&
                    activeKey.mode === mode
                }
            >
                {ks.map((k, idx) => (
                    <div key={idx}>
                        {formatNote(k) + (mode === "minor" ? "m" : "")}
                    </div>
                ))}
            </Button>
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
                            className={styles.circle + " " + styles.majorCircle}
                        >
                            {formatKeys(majorKeys, "major")}
                            <div
                                className={
                                    styles.circle + " " + styles.minorCircle
                                }
                            >
                                {formatKeys(minorKeys, "minor")}
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
                                      activeKey.mode === "major"
                                          ? naturalMajor.intervals
                                          : naturalMinor.intervals
                                  )
                                : []
                        }
                        startOctave={activeKey == null ? 0 : undefined}
                        endOctave={activeKey == null ? 1 : undefined}
                        className="mb-4"
                    />
                    {activeKey != null && (
                        <div>
                            <h3>Key</h3>
                            <div className="mb-4">
                                {`${formatNote(activeKey.tonic)} ${
                                    activeKey.mode === "major"
                                        ? "Major"
                                        : "Minor"
                                }`}
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
                                                        width: 100 / 8 + "%",
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
                                            activeKey.mode === "major"
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
