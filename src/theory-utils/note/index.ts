import {
    Accidental,
} from '../accidental/Accidental';
import { AccidentalSign } from "../accidental/AccidentalSign";
import { Letter } from '../letter/Letter';
import { LetterChar } from "../letter/LetterChar";
import { createAccidental, Natural } from '../accidental';

export class Note {
    constructor(
        letter: Letter | LetterChar,
        accidental: Accidental | AccidentalSign = new Natural(),
        public octave: number = 4
    ) {
        this.letter = letter instanceof Letter ? letter : new Letter(letter);
        this.accidental =
            accidental instanceof Accidental
                ? accidental
                : createAccidental(accidental);
    }

    letter: Letter;

    accidental: Accidental;

    get index() {
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
