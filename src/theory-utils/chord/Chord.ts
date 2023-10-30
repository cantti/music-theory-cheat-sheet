import _ from 'lodash';
import { Note } from '../note';
import { getNotesByIntervals } from '../utils/getNotesByIntervals';
import { ChordName } from './ChordName';
import { chordSchemas } from './chordSchemas';

export class Chord {
    constructor(
        readonly tonic: Note,
        readonly name: ChordName,
        readonly inversion: number = 0
    ) {}

    get shortName() {
        return chordSchemas[this.name].shortName;
    }

    get intervals() {
        return chordSchemas[this.name].intervals;
    }

    get notes() {
        return getNotesByIntervals(this.tonic, this.intervals).map(
            (note, i) =>
                new Note(
                    note.letter,
                    note.accidental,
                    (i < this.inversion % this.intervals.length
                        ? note.octave + 1
                        : note.octave) +
                        Math.floor(this.inversion / this.intervals.length)
                )
        );
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

    invert(number: number) {
        return new Chord(this.tonic, this.name, this.inversion + number);
    }
}
