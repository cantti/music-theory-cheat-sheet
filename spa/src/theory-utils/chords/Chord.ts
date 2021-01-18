import { Interval } from '../interval/Interval';
import { Note } from '../note/Note';
import { getNotesByIntervals } from '../helpers/getNotesByIntervals';

export abstract class Chord {
    constructor(public tonic: Note = new Note()) {}

    abstract name: string;
    abstract shortName: string;
    abstract intervals: Interval[];

    format(kind: 'short' | 'long' = 'short') {
        if (kind === 'short') {
            return this.tonic.format() + this.shortName;
        } else {
            return this.tonic.format() + ' ' + this.name;
        }
    }

    getNotes() {
        return getNotesByIntervals(this.tonic, this.intervals);
    }

    equals(chord: Chord) {
        return (
            chord.constructor.name === this.constructor.name &&
            chord.tonic.letter === this.tonic.letter &&
            chord.tonic.symbol === this.tonic.symbol
        );
    }
}
