import { useState } from "react";
import { Alert, Button, Card } from "react-bootstrap";
import { BsPlayFill } from "react-icons/bs";
import * as Tone from "tone";
import { pianoSynth } from "../audio/pianoSynth";
import { Accidental } from "../theory-utils/accidental";
import { Chord } from "../theory-utils/chord";
import { Note } from "../theory-utils/note";
import Piano from "./Piano";
import { startTone } from "../audio/startTone";
import { Scale } from "../theory-utils/scale";

interface NotesInScaleProps {
  scale: Scale;
}
export function ScaleInfo(props: NotesInScaleProps) {
  const [playingNote, setPlayingNote] = useState<Note | null>(null);

  async function playScale() {
    await startTone();
    new Tone.Part(
      (time, value) => {
        pianoSynth.triggerAttackRelease(value.note, 0.2, time);
        setPlayingNote(value.noteObj);
        if (value.noteObj.equals(props.scale.notesWithTopTonic.slice(-1)[0])) {
          setTimeout(() => {
            setPlayingNote(null);
          }, 1000 * 0.2);
        }
      },
      props.scale.notesWithTopTonic.map((note, index) => ({
        time: index * 0.2,
        note: note.format(true),
        noteObj: note,
      })),
    ).start();
    Tone.Transport.start();
  }

  function playChord(chord: Chord) {
    pianoSynth.triggerAttackRelease(
      chord.notes.map((x) => x.format(true)),
      0.5,
      Tone.now(),
      0.5,
    );
  }

  return (
    <div className="mb-3">
      <p>Notes of the selected key on the keyboard.</p>
      <div className="mb-3">
        <Piano
          highlightedNotes={
            playingNote ? [playingNote] : props.scale.notesWithTopTonic
          }
          startOctave={4}
          endOctave={5}
          playSounds={true}
        />
      </div>
      {props.scale.notes.some((x) =>
        new Array<Accidental>("##", "bb").includes(x.accidental),
      ) && (
        <Alert variant="danger">
          This is theoretical key because its key signature have at least one
          double-flat (bb) or double-sharp (##).
        </Alert>
      )}
      <div className="d-flex mb-3">
        {props.scale.notes.map((note, index) => {
          return (
            <Card
              key={props.scale.format() + note.format(true)}
              className="flex-even"
              bg={playingNote && note.equals(playingNote) ? "secondary" : ""}
              text={playingNote && note.equals(playingNote) ? "light" : "dark"}
            >
              <Card.Header className="text-center">{index + 1}</Card.Header>
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
        className="mb-3"
      >
        <BsPlayFill /> Play scale
      </Button>
      {props.scale.chords.length > 0 && (
        <>
          <p>The main chords of the selected key.</p>
          <div className="d-flex mb-3">
            {props.scale.chords.map((chord, index) => (
              <Card key={index} className="flex-even">
                <Card.Header className="text-center text-truncate">
                  {index + 1}
                </Card.Header>
                <Card.Body className="text-center fw-bold text-truncate px-0">
                  {chord[0].format("short")}
                </Card.Body>
                <Card.Footer className="text-center px-0">
                  <Button
                    size="sm"
                    onClick={() => playChord(props.scale.chords[index][0])}
                  >
                    <BsPlayFill />
                  </Button>
                </Card.Footer>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
