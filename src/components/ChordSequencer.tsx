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
        { chord: new Chord(new Note('C'), 'Major'), length: 4 },
        null,
        null,
        null,
        { chord: new Chord(new Note('F'), 'Major'), length: 4 },
        null,
        null,
        null,
        { chord: new Chord(new Note('G'), 'Major'), length: 4 },
        null,
        null,
        null,
        { chord: new Chord(new Note('A'), 'Minor'), length: 2 },
        null,
        { chord: new Chord(new Note('G'), 'Major'), length: 2 },
        null,
    ];

    function repeat() {
        const gridEvent = grid[beat];
        if (gridEvent) {
            pianoSynth.triggerAttackRelease(
                gridEvent.chord.notes.map((x) => x.format(true)),
                { "8n": gridEvent.length },
                Tone.now(),
                0.5
            );
        }

        beat = (beat + 1) % grid.length;
    }

    Tone.Transport.scheduleRepeat(repeat, '8n');

    return (
        <button
            onClick={() => {
                Tone.start();
                Tone.Transport.start();
            }}
        >
            Start
        </button>
    );
}
