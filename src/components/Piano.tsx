import React from 'react';
import { Note } from '../theory-utils/note/Note';
import styles from './Piano.module.css';
import { createPianoSynth } from '../piano-synth';
import { useState } from 'react';

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
                        whiteKey={new Note('C', 'None', octave)}
                        blackKey={new Note('C', 'Sharp', octave)}
                    />
                    <WhiteAndBlackKey
                        whiteKey={new Note('D', 'None', octave)}
                        blackKey={new Note('D', 'Sharp', octave)}
                    />
                    <WhiteAndBlackKey
                        whiteKey={new Note('E', 'None', octave)}
                    />
                    <WhiteAndBlackKey
                        whiteKey={new Note('F', 'None', octave)}
                        blackKey={new Note('F', 'Sharp', octave)}
                    />
                    <WhiteAndBlackKey
                        whiteKey={new Note('G', 'None', octave)}
                        blackKey={new Note('G', 'Sharp', octave)}
                    />
                    <WhiteAndBlackKey
                        whiteKey={new Note('A', 'None', octave)}
                        blackKey={new Note('A', 'Sharp', octave)}
                    />
                    <WhiteAndBlackKey
                        whiteKey={new Note('B', 'None', octave)}
                    />
                </div>
            ))}
        </div>
    );
};

export default Piano;
