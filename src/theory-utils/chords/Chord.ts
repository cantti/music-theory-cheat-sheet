import { Interval } from '../interval';
import { Note } from '../notes';
import { getNotesByIntervals } from '../utils/getNotesByIntervals';

export abstract class Chord {
    constructor(public tonic: Note) {}

    abstract readonly name: string;
    abstract readonly shortName: string;
    abstract readonly intervals: Interval[];

    format(kind: 'short' | 'long' = 'long', showOctave = false) {
        if (kind === 'short') {
            return this.tonic.format(showOctave) + this.shortName;
        } else {
            return this.tonic.format(showOctave) + ' ' + this.name;
        }
    }

    get notes() {
        return getNotesByIntervals(this.tonic, this.intervals);
    }

    equals(chord: Chord) {
        return (
            chord.name === this.name &&
            chord.tonic.letter === this.tonic.letter &&
            chord.tonic.accidental.equals(this.tonic.accidental)
        );
    }
}
