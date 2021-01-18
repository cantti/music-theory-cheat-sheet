import { Chord } from '../chords/Chord';
import { Interval } from '../interval/Interval';
import { Note } from '../note/Note';
import { getNotesByIntervals } from '../helpers/getNotesByIntervals';

export abstract class Scale {
    constructor(public tonic: Note = new Note()) {}

    abstract name: string;
    abstract shortName: string;
    abstract intervals: Interval[];

    getNotes() {
        return getNotesByIntervals(this.tonic, this.intervals);
    }

    format(kind: 'short' | 'long' = 'short') {
        if (kind === 'short') {
            return this.tonic.format() + this.shortName;
        } else {
            return this.tonic.format() + ' ' + this.name;
        }
    }

    equals(scale: Scale) {
        return (
            scale.constructor.name === this.constructor.name &&
            scale.tonic.letter === this.tonic.letter &&
            scale.tonic.symbol === this.tonic.symbol
        );
    }
}
