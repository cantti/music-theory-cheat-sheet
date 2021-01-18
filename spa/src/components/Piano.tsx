import React from 'react';
import { Note } from '../theory-utils/note/Note';
import styles from './Piano.module.css';

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
    className = '',
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
            .map((x) => x.getIndex())
            .includes(note.getIndex());

    return (
        <div className={styles.piano + ' ' + className}>
            {octaves.map((octave) => (
                <div className={styles.octave} key={octave}>
                    <div className={styles.whiteKey}>
                        <div className={styles.blackKey}>
                            {isHighlightNecessary(
                                new Note('C', 'Sharp', octave)
                            ) && <div className={styles.keyHighlighter} />}
                        </div>
                        {isHighlightNecessary(
                            new Note('C', 'None', octave)
                        ) && <div className={styles.keyHighlighter} />}
                    </div>
                    <div className={styles.whiteKey}>
                        <div className={styles.blackKey}>
                            {isHighlightNecessary(
                                new Note('D', 'Sharp', octave)
                            ) && <div className={styles.keyHighlighter} />}
                        </div>
                        {isHighlightNecessary(
                            new Note('D', 'None', octave)
                        ) && <div className={styles.keyHighlighter} />}
                    </div>
                    <div className={styles.whiteKey}>
                        {isHighlightNecessary(
                            new Note('E', 'None', octave)
                        ) && <div className={styles.keyHighlighter} />}
                    </div>
                    <div className={styles.whiteKey}>
                        <div className={styles.blackKey}>
                            {isHighlightNecessary(
                                new Note('F', 'Sharp', octave)
                            ) && <div className={styles.keyHighlighter} />}
                        </div>
                        {isHighlightNecessary(
                            new Note('F', 'None', octave)
                        ) && <div className={styles.keyHighlighter} />}
                    </div>
                    <div className={styles.whiteKey}>
                        <div className={styles.blackKey}>
                            {isHighlightNecessary(
                                new Note('G', 'Sharp', octave)
                            ) && <div className={styles.keyHighlighter} />}
                        </div>
                        {isHighlightNecessary(
                            new Note('G', 'None', octave)
                        ) && <div className={styles.keyHighlighter} />}
                    </div>
                    <div className={styles.whiteKey}>
                        <div className={styles.blackKey}>
                            {isHighlightNecessary(
                                new Note('A', 'Sharp', octave)
                            ) && <div className={styles.keyHighlighter} />}
                        </div>
                        {isHighlightNecessary(
                            new Note('A', 'None', octave)
                        ) && <div className={styles.keyHighlighter} />}
                    </div>
                    <div className={styles.whiteKey}>
                        {isHighlightNecessary(
                            new Note('B', 'None', octave)
                        ) && <div className={styles.keyHighlighter} />}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Piano;
