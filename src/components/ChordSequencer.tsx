import { Button, Card } from 'react-bootstrap';
import { pianoSynth } from '../audio/pianoSynth';
import { Chord, chord } from '../theory-utils/chord';
import { Note, n } from '../theory-utils/note';
import * as Tone from 'tone';
import { startTone } from '../audio/startTone';
import Table from 'react-bootstrap/Table';
import _ from 'lodash';
import { ReactElement } from 'react';

let beat = 0;

interface GridEvent {
    chord: Chord;
    length: number;
}

export function ChordSequencer() {
    const grid: (GridEvent | null)[] = [
        { chord: chord(n('C'), 'Major').invert(1), length: 4 },
        null,
        null,
        null,
        { chord: chord(n('F'), 'Major'), length: 8 },
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        { chord: chord(n('G'), 'Major'), length: 8 },
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        { chord: chord(n('A'), 'Minor'), length: 4 },
        null,
        null,
        null,
        { chord: chord(n('B'), 'Diminished'), length: 2 },
        null,
        null,
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

    const els: ReactElement[] = [];

    let current: GridEvent | null = null;

    for (let i = 0; i < grid.length; i++) {
        if (current && grid.indexOf(current) + current.length - 1 <= i) {
            current = null;
        }
        if (grid[i]) {
            current = grid[i];
        }
    }

    return (
        <div>
            <h3>Chord Sequencer</h3>
            <Table bordered responsive>
                <tbody>
                    <tr>
                        <td className="text-center fw-bold">#</td>
                        {grid.map((gridEvent, index) => (
                            <td
                                className="text-nowrap text-center text-muted"
                                key={index}
                            >
                                {index + 1}
                            </td>
                        ))}
                    </tr>
                    <tr>
                        <td className="text-center fw-bold">Chord</td>
                        {grid.map((gridEvent, index) => {
                            const prev = _(grid)
                                .slice(0, index)
                                .findLast((x) => x != null);
                            if (prev && !gridEvent) {
                                const iPrev = grid.indexOf(prev);
                                if (iPrev + prev.length - 1 >= index) {
                                    return null;
                                }
                            }
                            return (
                                <td
                                    className="text-nowrap text-center"
                                    key={index}
                                    colSpan={gridEvent?.length}
                                >
                                    <Button variant="primary" className="w-100">
                                        {gridEvent?.chord.format('short') ??
                                            'rest'}
                                    </Button>
                                </td>
                            );
                        })}
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
