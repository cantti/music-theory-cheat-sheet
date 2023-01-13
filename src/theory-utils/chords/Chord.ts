import { Interval } from '../interval/Interval';
import { Note } from '../note/Note';
import { getNotesByIntervals } from '../utils/getNotesByIntervals';

export abstract class Chord {
    constructor(public tonic: Note = new Note()) {}

    abstract readonly name: string;
    abstract readonly shortName: string;
    abstract readonly intervals: Interval[];

    format(kind: 'short' | 'long' = 'short', showOctave = false) {
        if (kind === 'short') {
            return this.tonic.format(showOctave) + this.shortName;
        } else {
            return this.tonic.format(showOctave) + ' ' + this.name;
        }
    }

    getNotes() {
        return getNotesByIntervals(this.tonic, this.intervals);
    }

    equals(chord: Chord) {
        return (
            chord.name === this.name &&
            chord.tonic.letter === this.tonic.letter &&
            chord.tonic.symbol.equals(this.tonic.symbol)
        );
    }
}
