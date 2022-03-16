import React, { createRef } from 'react';
import { Note } from '../theory-utils/note/Note';
import styles from './Piano.module.css';
import { createPianoSynth } from '../piano-synth';
import { useRef } from 'react';

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
        for (let k = 0; k < 12; k++) {
            keyRefs.current[new Note('C', '', i).getIndex() + k] = createRef();
        }
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

    const handleKeyMouseDown = (
        note: Note,
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        e.stopPropagation();
        playNote(note);
    };

    const handleKeyMouseUp = (
        note: Note,
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        stopNote(note);
    };

    const handleMouseOver = (
        note: Note,
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        if (e.buttons === 1) {
            e.stopPropagation();
            playNote(note);
        }
    };

    const handleMouseLeave = (
        note: Note,
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        if (e.buttons === 1) {
            stopNote(note);
        }
    };

    const WhiteAndBlackKey = ({
        whiteKey,
        blackKey,
    }: {
        whiteKey: Note;
        blackKey?: Note;
    }) => {
        return (
            <div
                className={styles.whiteKey}
                onMouseDown={(e) => handleKeyMouseDown(whiteKey, e)}
                onMouseOver={(e) => handleMouseOver(whiteKey, e)}
                onMouseLeave={(e) => handleMouseLeave(whiteKey, e)}
                onMouseUp={(e) => handleKeyMouseUp(whiteKey, e)}
                role="button"
                ref={keyRefs.current[whiteKey.getIndex()]}
            >
                {blackKey != null && (
                    <div
                        className={styles.blackKey}
                        onMouseDown={(e) => handleKeyMouseDown(blackKey, e)}
                        onMouseOver={(e) => handleMouseOver(blackKey, e)}
                        onMouseLeave={(e) => handleMouseLeave(blackKey, e)}
                        onMouseUp={(e) => handleKeyMouseUp(blackKey, e)}
                        role="button"
                        ref={keyRefs.current[blackKey.getIndex()]}
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
    };

    return (
        <div className={styles.piano + ' ' + className}>
            {octaves.map((octave, octaveIdx) => (
                <div className={styles.octave} key={octave}>
                    <WhiteAndBlackKey
                        whiteKey={new Note('C', '', octave)}
                        blackKey={new Note('C', '#', octave)}
                    />
                    <WhiteAndBlackKey
                        whiteKey={new Note('D', '', octave)}
                        blackKey={new Note('D', '#', octave)}
                    />
                    <WhiteAndBlackKey whiteKey={new Note('E', '', octave)} />
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
                    <WhiteAndBlackKey whiteKey={new Note('B', '', octave)} />
                </div>
            ))}
        </div>
    );
};

export default Piano;
