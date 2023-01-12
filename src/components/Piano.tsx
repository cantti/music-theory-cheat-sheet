import React, { useRef } from 'react';
import { createPianoSynth } from '../piano-synth';
import { Note } from '../theory-utils/note/Note';
import { isTouchDevice } from '../utils/isTouchDevice';
import styles from './Piano.module.css';

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
    if (startOctave == null || endOctave == null) {
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

    const keyRefs = useRef<{
        [noteIndex: number]: React.RefObject<HTMLDivElement>;
    }>({});

    let octaves: number[] = [];

    for (let i = startOctave; i <= endOctave; i++) {
        octaves.push(i);
    }

    const isHighlightNecessary = (note: Note) =>
        highlightedNotes.map((x) => x.getIndex()).includes(note.getIndex());

    const playNote = (note: Note) => {
        pianoSynth.triggerAttack(note.format());
        const ref = keyRefs.current[note.getIndex()];
        ref.current!.classList.add(styles.activeKey);
    };

    const stopNote = (note: Note) => {
        pianoSynth.triggerRelease(note.format());
        const ref = keyRefs.current[note.getIndex()];
        ref.current!.classList.remove(styles.activeKey);
    };

    const Key = ({
        note,
        children,
        className,
    }: {
        note: Note;
        children?: React.ReactNode;
        className: string;
    }) => {
        const ref = useRef<HTMLDivElement>(null);
        keyRefs.current[note.getIndex()] = ref;
        return (
            <div
                className={className}
                onMouseDown={(e) => {
                    e.stopPropagation();
                    if (isTouchDevice()) return;
                    playNote(note);
                }}
                onMouseUp={(e) => {
                    e.stopPropagation();
                    if (isTouchDevice()) return;
                    stopNote(note);
                }}
                onMouseLeave={(e) => {
                    e.stopPropagation();
                    if (isTouchDevice()) return;
                    if (e.buttons === 1) {
                        stopNote(note);
                    }
                }}
                onTouchStart={(e) => {
                    e.stopPropagation();
                    playNote(note);
                }}
                onTouchEnd={(e) => {
                    e.stopPropagation();
                    stopNote(note);
                }}
                role="button"
                ref={ref}
            >
                {children}
                {isHighlightNecessary(note) && (
                    <div className={styles.keyHighlighter} />
                )}
            </div>
        );
    };

    const WhiteAndBlackKey = ({
        whiteKeyNote,
        blackKeyNote,
    }: {
        whiteKeyNote: Note;
        blackKeyNote?: Note;
    }) => {
        return (
            <Key className={styles.whiteKey} note={whiteKeyNote}>
                {blackKeyNote != null && (
                    <Key className={styles.blackKey} note={blackKeyNote} />
                )}
            </Key>
        );
    };

    return (
        <div className={styles.piano + ' ' + className}>
            {octaves.map((octave, octaveIdx) => (
                <div className={styles.octave} key={octave}>
                    <WhiteAndBlackKey
                        whiteKeyNote={new Note('C', '', octave)}
                        blackKeyNote={new Note('C', '#', octave)}
                    />
                    <WhiteAndBlackKey
                        whiteKeyNote={new Note('D', '', octave)}
                        blackKeyNote={new Note('D', '#', octave)}
                    />
                    <WhiteAndBlackKey
                        whiteKeyNote={new Note('E', '', octave)}
                    />
                    <WhiteAndBlackKey
                        whiteKeyNote={new Note('F', '', octave)}
                        blackKeyNote={new Note('F', '#', octave)}
                    />
                    <WhiteAndBlackKey
                        whiteKeyNote={new Note('G', '', octave)}
                        blackKeyNote={new Note('G', '#', octave)}
                    />
                    <WhiteAndBlackKey
                        whiteKeyNote={new Note('A', '', octave)}
                        blackKeyNote={new Note('A', '#', octave)}
                    />
                    <WhiteAndBlackKey
                        whiteKeyNote={new Note('B', '', octave)}
                    />
                </div>
            ))}
        </div>
    );
};

export default Piano;
