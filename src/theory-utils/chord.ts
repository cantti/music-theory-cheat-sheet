import _ from 'lodash';
import { Note } from './note';
import { getNotesByIntervals } from './getNotesByIntervals';
import { Interval, interval } from './interval';

export type ChordName = 'Minor' | 'Major' | 'Diminished' | 'Augmented';

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
        const tonic = this.tonic.format(showOctave);
        const chordName = kind === 'short' ? this.shortName : ' ' + this.name;
        const lowestNote = _.minBy(this.notes, (x) => x.index)?.format(false);
        const inv =
            lowestNote !== this.tonic.format(false) ? ' / ' + lowestNote : '';
        return `${tonic}${chordName}${inv}`;
    }

    equals(chord: Chord) {
        return (
            chord.name === this.name &&
            chord.tonic.letter === this.tonic.letter &&
            chord.tonic.accidental == this.tonic.accidental
        );
    }

    invert(number: number) {
        return new Chord(this.tonic, this.name, this.inversion + number);
    }
}

export function chord(tonic: Note, name: ChordName, inversion: number = 0) {
    return new Chord(tonic, name, inversion);
}

type ChordSchema = {
    shortName: string;
    intervals: Interval[];
};

type ChordSchemas = {
    [K in ChordName]: ChordSchema;
};

export const chordSchemas: ChordSchemas = {
    Minor: {
        shortName: 'm',
        intervals: [interval('Third', 'Minor'), interval('Fifth', 'Perfect')],
    },
    Major: {
        shortName: '',
        intervals: [interval('Third', 'Major'), interval('Fifth', 'Perfect')],
    },
    Diminished: {
        shortName: 'dim',
        intervals: [
            interval('Third', 'Minor'),
            interval('Fifth', 'Diminished'),
        ],
    },
    Augmented: {
        shortName: 'aug',
        intervals: [interval('Third', 'Major'), interval('Fifth', 'Augmented')],
    },
};
