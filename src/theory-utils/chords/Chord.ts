import { Interval } from '../interval/Interval';
import { Note } from '../note/Note';
import { getNotesByIntervals } from '../utils/getNotesByIntervals';

export abstract class Chord {
    constructor(public tonic: Note = new Note()) {}

    protected _name: string = '';
    protected _shortName: string = '';
    protected _intervals: Interval[] = [];

    get name() {
        return this._name;
    }

    get shortName(): string {
        return this._shortName;
    }

    get intervals(): Interval[] {
        return this._intervals;
    }

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
