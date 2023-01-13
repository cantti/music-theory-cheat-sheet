import { allAccidentals, Natural, Accidental } from './accidentals';
import { allLetters, C, Letter } from './letters';

export class Note {
    constructor(
        public letter: Letter = new C(),
        public accidental: Accidental = new Natural(),
        public octave: number = 4
    ) {}

    static create(string: string) {
        const pattern =
            /^(?<letter>[cdefgab])(?<accidental>[#b]?)(?<octave>\d?)$/i;
        const match = string.match(pattern);
        if (!match?.groups) {
            throw new Error();
        }
        const letter = match.groups.letter.toUpperCase();
        const accidental = match.groups.accidental.toLowerCase();
        const octave =
            match.groups.octave !== ''
                ? parseInt(match.groups.octave)
                : undefined;
        return new Note(
            allLetters.find((x) => x.char === letter),
            allAccidentals.find((x) => x.sign === accidental),
            octave
        );
    }

    getIndex() {
        return this.octave * 12 + this.letter.index + this.accidental.shift;
    }

    format(showOctave: boolean = false) {
        let result: string =
            this.letter.toString() + this.accidental.toString();
        if (showOctave) {
            result += this.octave;
        }
        return result;
    }

    equals(other: Note) {
        return (
            this.letter.equals(other.letter) &&
            this.octave === other.octave &&
            this.accidental.equals(other.accidental)
        );
    }
}
