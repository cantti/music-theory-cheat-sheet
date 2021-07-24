import { Interval } from '../interval/Interval';
import { Note } from '../note/Note';
import { getNotesByIntervals } from '../utils/getNotesByIntervals';

export abstract class Chord {
    constructor(public tonic: Note = new Note()) {}

    abstract getName(): string;

    abstract getShortName(): string;

    abstract getIntervals(): Interval[];

    format(kind: 'short' | 'long' = 'short') {
        if (kind === 'short') {
            return this.tonic.format() + this.getShortName();
        } else {
            return this.tonic.format() + ' ' + this.getName();
        }
    }

    getNotes() {
        return getNotesByIntervals(this.tonic, this.getIntervals());
    }

    equals(chord: Chord) {
        return (
            chord.getName() === this.getName() &&
            chord.tonic.letter === this.tonic.letter &&
            chord.tonic.symbol === this.tonic.symbol
        );
    }
}
