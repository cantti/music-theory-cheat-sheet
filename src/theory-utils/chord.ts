import _ from 'lodash';
import { Note } from './note';
import { getNotesByIntervals } from './getNotesByIntervals';
import { Interval, interval } from './interval';

export type ChordName = 'Minor' | 'Major' | 'Diminished' | 'Augmented';

export class Chord {
  constructor(
    public tonic: Note,
    public name: ChordName,
    public inversion: number = 0,
  ) {}

  get shortName() {
    return chordSchemas[this.name].shortName;
  }

  get intervals() {
    return chordSchemas[this.name].intervals;
  }

  get notes() {
    const notes = getNotesByIntervals(this.tonic, this.intervals);
    if (this.inversion > 0) {
      for (let i = 0; i < this.inversion; i++) {
        const minNote = _.minBy(notes, (x) => x.index)!;
        minNote.octave += 1;
      }
    }
    if (this.inversion < 0) {
      for (let i = 0; i > this.inversion; i--) {
        const minNote = _.maxBy(notes, (x) => x.index)!;
        minNote.octave -= 1;
      }
    }
    return _.orderBy(notes, (x) => x.index);
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
    intervals: [interval('Third', 'Minor'), interval('Fifth', 'Diminished')],
  },
  Augmented: {
    shortName: 'aug',
    intervals: [interval('Third', 'Major'), interval('Fifth', 'Augmented')],
  },
};
