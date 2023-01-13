import React, { useRef } from 'react';
import { createPianoSynth } from '../piano-synth';
import { C, D, E, F, G, A, B } from '../theory-utils/letters';
import { Note } from '../theory-utils/notes';
import { None, Sharp } from '../theory-utils/symbols';
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
        pianoSynth.triggerAttack(note.format(true));
        const ref = keyRefs.current[note.getIndex()];
        ref.current!.classList.add(styles.activeKey);
    };

    const stopNote = (note: Note) => {
        pianoSynth.triggerRelease(note.format(true));
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
                        whiteKeyNote={new Note(new C(), new None(), octave)}
                        blackKeyNote={new Note(new C(), new Sharp(), octave)}
                    />
                    <WhiteAndBlackKey
                        whiteKeyNote={new Note(new D(), new None(), octave)}
                        blackKeyNote={new Note(new D(), new Sharp(), octave)}
                    />
                    <WhiteAndBlackKey
                        whiteKeyNote={new Note(new E(), new None(), octave)}
                    />
                    <WhiteAndBlackKey
                        whiteKeyNote={new Note(new F(), new None(), octave)}
                        blackKeyNote={new Note(new F(), new Sharp(), octave)}
                    />
                    <WhiteAndBlackKey
                        whiteKeyNote={new Note(new G(), new None(), octave)}
                        blackKeyNote={new Note(new G(), new Sharp(), octave)}
                    />
                    <WhiteAndBlackKey
                        whiteKeyNote={new Note(new A(), new None(), octave)}
                        blackKeyNote={new Note(new A(), new Sharp(), octave)}
                    />
                    <WhiteAndBlackKey
                        whiteKeyNote={new Note(new B(), new None(), octave)}
                    />
                </div>
            ))}
        </div>
    );
};

export default Piano;