import { Accidental, accidentalSchemas } from './accidental';
import { Letter, letterSchemas } from './letter';

export class Note {
  constructor(
    public letter: Letter,
    public accidental: Accidental = '',
    public octave: number = 4,
  ) {}

  get index() {
    return (
      this.octave * 12 +
      letterSchemas[this.letter].index +
      accidentalSchemas[this.accidental].shift
    );
  }

  format(showOctave: boolean) {
    let result: string = this.letter.toString() + this.accidental.toString();
    if (showOctave) {
      result += this.octave;
    }
    return result;
  }

  equals(other: Note) {
    return (
      this.letter === other.letter &&
      this.octave === other.octave &&
      this.accidental == other.accidental
    );
  }
}

export function n(
  letter: Letter,
  accidental: Accidental = '',
  octave: number = 4,
) {
  return new Note(letter, accidental, octave);
}
