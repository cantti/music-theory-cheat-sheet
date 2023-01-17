import { Chord } from '../chord';
import { Note } from '../note';
import { getNotesByIntervals } from '../utils/getNotesByIntervals';
import { ScaleName } from './ScaleName';
import { scaleSchemas } from './scaleSchemas';

export class Scale {
    constructor(public tonic: Note, public readonly name: ScaleName) {}

    get shortName() {
        return scaleSchemas[this.name].shortName;
    }

    get notes() {
        return getNotesByIntervals(this.tonic, this.intervals);
    }

    get intervals() {
        return scaleSchemas[this.name].intervals;
    }

    get chords() {
        return scaleSchemas[this.name].chords.map((chords, index) =>
            chords.map((chord) => new Chord(this.notes[index], chord))
        );
    }

    format(kind: 'short' | 'long' = 'long', showOctave: boolean = false) {
        if (kind === 'short') {
            return this.tonic.format(showOctave) + this.shortName;
        } else {
            return this.tonic.format(showOctave) + ' ' + this.name;
        }
    }
}
