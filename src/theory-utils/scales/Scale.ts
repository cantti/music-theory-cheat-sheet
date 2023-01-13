import { Chord } from '../chords/Chord';
import { Interval } from '../interval/Interval';
import { Note } from '../note/Note';
import { getNotesByIntervals } from '../utils/getNotesByIntervals';

export abstract class Scale {
    constructor(public tonic: Note = new Note()) {}

    abstract readonly name: string;

    abstract readonly shortName: string;

    abstract readonly intervals: Interval[];

    getNotes() {
        return getNotesByIntervals(this.tonic, this.intervals);
    }

    format(kind: 'short' | 'long' = 'short') {
        if (kind === 'short') {
            return this.tonic.format(false) + this.shortName;
        } else {
            return this.tonic.format(false) + ' ' + this.name;
        }
    }

    getChords(){}
}
