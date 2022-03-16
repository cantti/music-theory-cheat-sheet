import { Interval } from '../interval/Interval';
import { Note } from '../note/Note';
import { getNotesByIntervals } from '../utils/getNotesByIntervals';

export abstract class Scale {
    constructor(public tonic: Note = new Note()) {}

    abstract getName(): string;

    abstract getShortName(): string;

    abstract getIntervals(): Interval[];

    getNotes() {
        return getNotesByIntervals(this.tonic, this.getIntervals());
    }

    format(kind: 'short' | 'long' = 'short') {
        if (kind === 'short') {
            return this.tonic.format(false) + this.getShortName();
        } else {
            return this.tonic.format(false) + ' ' + this.getName();
        }
    }
}