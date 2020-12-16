import React from "react";
import { getNoteIndex } from "../theory-utils/getNoteIndex";
import { Note } from "../theory-utils/types/Note";
import styles from "./Piano.module.css";

type PianoProps = {
    highlightedNotes?: Note[];
    startOctave?: number;
    endOctave?: number;
    className?: string;
};

const Piano = ({
    highlightedNotes = [],
    startOctave = undefined,
    endOctave = undefined,
    className = "",
}: PianoProps) => {
    let octaves: number[] = [];

    if (startOctave === undefined || endOctave === undefined) {
        if (highlightedNotes.length > 0) {
            const sortedHighlightedNotes = highlightedNotes.sort(
                (a, b) => a.octave - b.octave
            );
            startOctave = sortedHighlightedNotes[0].octave;
            endOctave = sortedHighlightedNotes.reverse()[0].octave;
        } else {
            startOctave = 0;
            endOctave = 0;
        }
    }

    for (let i = startOctave; i <= endOctave; i++) {
        octaves.push(i);
    }

    const isHighlightNecessary = (note: Note) =>
        highlightedNotes
            .map((x) => getNoteIndex(x))
            .includes(getNoteIndex(note));

    return (
        <div className={styles.piano + " " + className}>
            {octaves.map((octave) => (
                <div className={styles.octave} key={octave}>
                    <div className={styles.whiteKey}>
                        <div className={styles.blackKey}>
                            {isHighlightNecessary({
                                letter: "C",
                                symbol: "Sharp",
                                octave: octave,
                            }) && <div className={styles.keyHighlighter} />}
                        </div>
                        {isHighlightNecessary({
                            letter: "C",
                            symbol: "None",
                            octave: octave,
                        }) && <div className={styles.keyHighlighter} />}
                    </div>
                    <div className={styles.whiteKey}>
                        <div className={styles.blackKey}>
                            {isHighlightNecessary({
                                letter: "D",
                                symbol: "Sharp",
                                octave: octave,
                            }) && <div className={styles.keyHighlighter} />}
                        </div>
                        {isHighlightNecessary({
                            letter: "D",
                            symbol: "None",
                            octave: octave,
                        }) && <div className={styles.keyHighlighter} />}
                    </div>
                    <div className={styles.whiteKey}>
                        {isHighlightNecessary({
                            letter: "E",
                            symbol: "None",
                            octave: octave,
                        }) && <div className={styles.keyHighlighter} />}
                    </div>
                    <div className={styles.whiteKey}>
                        <div className={styles.blackKey}>
                            {isHighlightNecessary({
                                letter: "F",
                                symbol: "Sharp",
                                octave: octave,
                            }) && <div className={styles.keyHighlighter} />}
                        </div>
                        {isHighlightNecessary({
                            letter: "F",
                            symbol: "None",
                            octave: octave,
                        }) && <div className={styles.keyHighlighter} />}
                    </div>
                    <div className={styles.whiteKey}>
                        <div className={styles.blackKey}>
                            {isHighlightNecessary({
                                letter: "G",
                                symbol: "Sharp",
                                octave: octave,
                            }) && <div className={styles.keyHighlighter} />}
                        </div>
                        {isHighlightNecessary({
                            letter: "G",
                            symbol: "None",
                            octave: octave,
                        }) && <div className={styles.keyHighlighter} />}
                    </div>
                    <div className={styles.whiteKey}>
                        <div className={styles.blackKey}>
                            {isHighlightNecessary({
                                letter: "A",
                                symbol: "Sharp",
                                octave: octave,
                            }) && <div className={styles.keyHighlighter} />}
                        </div>
                        {isHighlightNecessary({
                            letter: "A",
                            symbol: "None",
                            octave: octave,
                        }) && <div className={styles.keyHighlighter} />}
                    </div>
                    <div className={styles.whiteKey}>
                        {isHighlightNecessary({
                            letter: "B",
                            symbol: "None",
                            octave: octave,
                        }) && <div className={styles.keyHighlighter} />}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Piano;
