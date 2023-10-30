import { Card, CardGroup } from 'react-bootstrap';
import { pianoSynth } from '../audio/pianoSynth';
import { Chord } from '../theory-utils/chord';
import { Note } from '../theory-utils/note';
import * as Tone from 'tone';

let beat = 0;

interface GridEvent {
    chord: Chord;
    length: number;
}

export function ChordSequencer() {
    const grid: (GridEvent | null)[] = [
        { chord: new Chord(new Note('C'), 'Major').invert(1), length: 8 },
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        { chord: new Chord(new Note('F'), 'Major'), length: 8 },
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        { chord: new Chord(new Note('G'), 'Major'), length: 8 },
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        { chord: new Chord(new Note('A'), 'Minor'), length: 4 },
        null,
        null,
        null,
        null,
        null,
        { chord: new Chord(new Note('B'), 'Diminished'), length: 2 },
        null,
    ];

    function repeat() {
        const gridEvent = grid[beat];
        if (gridEvent) {
            pianoSynth.triggerAttackRelease(
                gridEvent.chord.notes.map((x) => x.format(true)),
                { '8n': gridEvent.length },
                Tone.now(),
                0.5
            );
        }

        beat = (beat + 1) % grid.length;
    }

    return (
        <div>
            <div style={{ overflowX: 'scroll', display: 'flex' }}>
                {grid.map((gridEvent, index) => (
                    <Card style={{ minWidth: '100px' }}>
                        <Card.Body>
                            <Card.Title>{index + 1}</Card.Title>
                            <Card.Text>
                                {gridEvent?.chord.format('short') ?? 'rest'}
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer>del</Card.Footer>
                    </Card>
                ))}
            </div>
            <button
                onClick={() => {
                    Tone.Transport.scheduleRepeat(repeat, '8n');
                    Tone.start();
                    Tone.Transport.start();
                }}
            >
                Start
            </button>
        </div>
    );
}
