import { Interval } from '../interval';
import { Note } from '../notes';
import { getNotesByIntervals } from '../utils/getNotesByIntervals';
import { ChordName } from './ChordName';
import { chordSchemas } from './chordSchemas';

export class Chord {
    constructor(public tonic: Note, public name: ChordName) {}

    get shortName() {
        return chordSchemas[this.name].shortName;
    }

    get intervals() {
        return chordSchemas[this.name].intervals;
    }

    get notes() {
        return getNotesByIntervals(this.tonic, this.intervals);
    }

    format(kind: 'short' | 'long' = 'long', showOctave = false) {
        if (kind === 'short') {
            return this.tonic.format(showOctave) + this.shortName;
        } else {
            return this.tonic.format(showOctave) + ' ' + this.name;
        }
    }

    equals(chord: Chord) {
        return (
            chord.name === this.name &&
            chord.tonic.letter === this.tonic.letter &&
            chord.tonic.accidental.equals(this.tonic.accidental)
        );
    }
}
