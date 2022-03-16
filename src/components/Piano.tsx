import React from 'react';
import { Note } from '../theory-utils/note/Note';
import styles from './Piano.module.css';
import { createPianoSynth } from '../piano-synth';

const pianoSynth = createPianoSynth();

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
        highlightedNotes.map((x) => x.getIndex()).includes(note.getIndex());

    const handleKeyMouseDown = (
        note: Note,
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        e.stopPropagation();
        pianoSynth.triggerAttack(note.format());
    };

    const handleKeyMouseUp = (
        note: Note,
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        pianoSynth.triggerRelease(note.format());
    };

    const handleMouseOver = (
        note: Note,
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        if (e.buttons === 1) {
            e.stopPropagation();
            pianoSynth.triggerAttack(note.format());
        }
    };

    const handleMouseLeave = (
        note: Note,
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        if (e.buttons === 1) {
            pianoSynth.triggerRelease(note.format());
        }
    };

    const WhiteAndBlackKey = ({
        whiteKey,
        blackKey,
    }: {
        whiteKey: Note;
        blackKey?: Note;
    }) => (
        <div
            className={styles.whiteKey}
            onMouseDown={(e) => handleKeyMouseDown(whiteKey, e)}
            onMouseOver={(e) => handleMouseOver(whiteKey, e)}
            onMouseLeave={(e) => handleMouseLeave(whiteKey, e)}
            onMouseUp={(e) => handleKeyMouseUp(whiteKey, e)}
            role="button"
        >
            {blackKey != null && (
                <div
                    className={styles.blackKey}
                    onMouseDown={(e) => handleKeyMouseDown(blackKey, e)}
                    onMouseOver={(e) => handleMouseOver(blackKey, e)}
                    onMouseLeave={(e) => handleMouseLeave(blackKey, e)}
                    onMouseUp={(e) => handleKeyMouseUp(blackKey, e)}
                    role="button"
                >
                    {isHighlightNecessary(blackKey) && (
                        <div className={styles.keyHighlighter} />
                    )}
                </div>
            )}
            {isHighlightNecessary(whiteKey) && (
                <div className={styles.keyHighlighter} />
            )}
        </div>
    );

    return (
        <div className={styles.piano + ' ' + className}>
            {octaves.map((octave) => (
                <div className={styles.octave} key={octave}>
                    <WhiteAndBlackKey
                        whiteKey={new Note('C', '', octave)}
                        blackKey={new Note('C', '#', octave)}
                    />
                    <WhiteAndBlackKey
                        whiteKey={new Note('D', '', octave)}
                        blackKey={new Note('D', '#', octave)}
                    />
                    <WhiteAndBlackKey
                        whiteKey={new Note('E', '', octave)}
                    />
                    <WhiteAndBlackKey
                        whiteKey={new Note('F', '', octave)}
                        blackKey={new Note('F', '#', octave)}
                    />
                    <WhiteAndBlackKey
                        whiteKey={new Note('G', '', octave)}
                        blackKey={new Note('G', '#', octave)}
                    />
                    <WhiteAndBlackKey
                        whiteKey={new Note('A', '', octave)}
                        blackKey={new Note('A', '#', octave)}
                    />
                    <WhiteAndBlackKey
                        whiteKey={new Note('B', '', octave)}
                    />
                </div>
            ))}
        </div>
    );
};

export default Piano;
