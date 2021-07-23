import { Interval } from '../interval/Interval';
import { Note } from '../note/Note';
import { getNotesByIntervals } from '../utils/getNotesByIntervals';

export abstract class Scale {
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

    getNotes() {
        return getNotesByIntervals(this.tonic, this._intervals);
    }

    format(kind: 'short' | 'long' = 'short') {
        if (kind === 'short') {
            return this.tonic.format() + this._shortName;
        } else {
            return this.tonic.format() + ' ' + this._name;
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
