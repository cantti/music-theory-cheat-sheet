import { Chord } from '../chords/Chord';
import { Interval } from '../interval';
import { Note } from '../notes';
import { getNotesByIntervals } from '../utils/getNotesByIntervals';

export abstract class Scale {
    constructor(public tonic: Note = new Note()) {}

    abstract readonly name: string;

    abstract readonly shortName: string;

    abstract readonly intervals: Interval[];

    abstract get chords(): Chord[][];

    get notes() {
        return getNotesByIntervals(this.tonic, this.intervals);
    }

    format(kind: 'short' | 'long' = 'short', showOctave: boolean = false) {
        if (kind === 'short') {
            return this.tonic.format(showOctave) + this.shortName;
        } else {
            return this.tonic.format(showOctave) + ' ' + this.name;
        }
    }
}
