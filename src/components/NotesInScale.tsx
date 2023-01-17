import { useState } from 'react';
import { Alert, Button, Card } from 'react-bootstrap';
import { BsPlayFill } from 'react-icons/bs';
import * as Tone from 'tone';
import { pianoSynth } from '../audio/pianoSynth';
import { AccidentalSign } from '../theory-utils/accidental';
import { Note } from '../theory-utils/note';
import { Scale } from '../theory-utils/scale/Scale';
import Piano from './Piano';

interface NotesInScaleProps {
    scale: Scale;
}
export function NotesInScale(props: NotesInScaleProps) {
    const [playingNote, setPlayingNote] = useState<Note | null>(null);
    async function playScale() {
        await Tone.start();
        new Tone.Part(
            (time, value) => {
                pianoSynth.triggerAttackRelease(value.note, 0.2, time);
                setPlayingNote(value.noteObj);
                if (value.noteObj.equals(props.scale.notes.slice(-1)[0])) {
                    setTimeout(() => {
                        setPlayingNote(null);
                    }, 1000 * 0.2);
                }
            },
            props.scale.notes.map((note, index) => ({
                time: index * 0.2,
                note: note.format(true),
                noteObj: note,
            }))
        ).start();
        Tone.Transport.start();
    }

    return (
        <div className="mb-3">
            <p>Notes of the selected key on the keyboard.</p>
            <div className="mb-3">
                <Piano
                    highlightedNotes={
                        playingNote ? [playingNote] : props.scale.notes
                    }
                    startOctave={4}
                    endOctave={5}
                />
            </div>
            {props.scale.notes.some((x) =>
                (['##', 'bb'] as AccidentalSign[]).includes(x.accidental.sign)
            ) && (
                <Alert variant="danger">
                    This is theoretical key because its key signature have at
                    least one double-flat (bb) or double-sharp (##).
                </Alert>
            )}
            <div className="d-flex mb-3">
                {props.scale.notes.map((note, index) => {
                    return (
                        <Card
                            key={props.scale.format() + note.format(true)}
                            className="flex-even"
                            bg={
                                playingNote && note.equals(playingNote)
                                    ? 'secondary'
                                    : ''
                            }
                            text={
                                playingNote && note.equals(playingNote)
                                    ? 'light'
                                    : 'dark'
                            }
                        >
                            <Card.Header className="text-center">
                                {index + 1}
                            </Card.Header>
                            <Card.Body className="text-center fw-bold text-truncate px-0">
                                {note.format(false)}
                            </Card.Body>
                        </Card>
                    );
                })}
            </div>
            <Button
                onClick={playScale}
                disabled={playingNote != null}
                size="sm"
            >
                <BsPlayFill /> Play scale
            </Button>
        </div>
    );
}
