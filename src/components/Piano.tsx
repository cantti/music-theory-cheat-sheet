import { motion } from 'framer-motion';
import { createPianoSynth } from '../piano-synth';
import { Note } from '../theory-utils/notes';
import styles from './Piano.module.scss';

const pianoSynth = createPianoSynth();

interface PianoProps {
    highlightedNotes?: Note[];
    startOctave?: number;
    endOctave?: number;
    className?: string;
    onNoteClick?: (note: Note) => void;
}

function Piano({
    highlightedNotes = [],
    startOctave = undefined,
    endOctave = undefined,
    className = '',
    onNoteClick = () => {},
}: PianoProps) {
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

    let octaves: number[] = [];

    for (let i = startOctave; i <= endOctave; i++) {
        octaves.push(i);
    }

    function isHighlightNecessary(note: Note) {
        return highlightedNotes
            .map((x) => x.getIndex())
            .includes(note.getIndex());
    }

    function playNote(note: Note) {
        pianoSynth.triggerAttack(note.format(true));
    }

    function stopNote(note: Note) {
        pianoSynth.triggerRelease(note.format(true));
    }

    function Key(props: { note: Note }) {
        return (
            <motion.div
                whileTap={{ scale: 0.95 }}
                className={
                    props.note.accidental.sign
                        ? styles.blackKey
                        : styles.whiteKey
                }
                role="button"
                onClick={() => {
                    onNoteClick(props.note);
                }}
                onMouseDown={(e) => {
                    playNote(props.note);
                }}
                onMouseUp={(e) => {
                    stopNote(props.note);
                }}
                onMouseLeave={(e) => {
                    if (e.buttons === 1) {
                        stopNote(props.note);
                    }
                }}
            >
                {isHighlightNecessary(props.note) && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        exit={{ x: -300, opacity: 0 }}
                        className={styles.dot}
                    />
                )}
            </motion.div>
        );
    }

    return (
        <div className={styles.piano + ' ' + className}>
            {octaves.map((octave) => (
                <div className={styles.octave} key={octave}>
                    <div className={styles.blackKeysWrapper}>
                        {[
                            Note.create('C#' + octave),
                            Note.create('D#' + octave),
                            Note.create('F#' + octave),
                            Note.create('G#' + octave),
                            Note.create('A#' + octave),
                        ].map((note) => (
                            <Key note={note} key={note.format(true)} />
                        ))}
                    </div>
                    <div className={styles.whiteKeysWrapper}>
                        {[
                            Note.create('C' + octave),
                            Note.create('D' + octave),
                            Note.create('E' + octave),
                            Note.create('F' + octave),
                            Note.create('G' + octave),
                            Note.create('A' + octave),
                            Note.create('B' + octave),
                        ].map((note) => (
                            <Key note={note} key={note.format(true)} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Piano;
