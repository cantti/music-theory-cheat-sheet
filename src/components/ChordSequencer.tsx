import { Card } from 'react-bootstrap';
import { pianoSynth } from '../audio/pianoSynth';
import { Chord } from '../theory-utils/chord';
import { Note } from '../theory-utils/note';
import * as Tone from 'tone';
import { startTone } from '../audio/startTone';
import Table from 'react-bootstrap/Table';

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
            <h3>Chord Sequencer</h3>
            <Table bordered responsive>
                <tbody>
                    <tr>
                        <td className="text-center fw-bold">#</td>
                        {grid.map((gridEvent, index) => (
                            <td className="text-nowrap text-center text-muted">
                                {index}
                            </td>
                        ))}
                    </tr>
                    <tr>
                        <td className="text-center fw-bold">Chord</td>
                        {grid.map((gridEvent, index) => (
                            <td className="text-nowrap text-center">
                                <div style={{ width: '50px' }}>
                                    {gridEvent?.chord.format('short') ?? ''}
                                </div>
                            </td>
                        ))}
                    </tr>
                </tbody>
            </Table>
            <button
                onClick={async () => {
                    await startTone();
                    Tone.Transport.scheduleRepeat(repeat, '8n');
                    Tone.Transport.start();
                }}
            >
                Start
            </button>
        </div>
    );
}
