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
    useFlats?: boolean;
}

function Piano({
    highlightedNotes = [],
    startOctave = undefined,
    endOctave = undefined,
    className = '',
    onNoteClick = () => {},
    useFlats = false,
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
        return highlightedNotes.map((x) => x.index).includes(note.index);
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
                    <div className={styles.dot} />
                )}
            </motion.div>
        );
    }

    return (
        <div className={styles.piano + ' ' + className}>
            {octaves.map((octave) => (
                <div className={styles.octave} key={octave}>
                    <div className={styles.blackKeysWrapper}>
                        {(useFlats
                            ? [
                                  new Note('D', 'b', octave),
                                  new Note('E', 'b', octave),
                                  new Note('G', 'b', octave),
                                  new Note('A', 'b', octave),
                                  new Note('B', 'b', octave),
                              ]
                            : [
                                  new Note('C', '#', octave),
                                  new Note('D', '#', octave),
                                  new Note('F', '#', octave),
                                  new Note('G', '#', octave),
                                  new Note('A', '#', octave),
                              ]
                        ).map((note) => (
                            <Key note={note} key={note.format(true)} />
                        ))}
                    </div>
                    <div className={styles.whiteKeysWrapper}>
                        {[
                            new Note('C', '', octave),
                            new Note('D', '', octave),
                            new Note('E', '', octave),
                            new Note('F', '', octave),
                            new Note('G', '', octave),
                            new Note('A', '', octave),
                            new Note('B', '', octave),
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
