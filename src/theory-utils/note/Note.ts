import { getLetterIndices } from '../utils/getLetterIndices';
import { isLetter } from '../utils/isLetter';
import { Letter } from './Letter';
import { allSymbols, None, Symbol } from '../symbols';

export class Note {
    constructor(
        public letter: Letter = 'C',
        public symbol: Symbol = new None(),
        public octave: number = 4
    ) {}

    static fromString(string: string) {
        const pattern = /^(?<letter>[cdefgab])(?<symbol>[#b]?)(?<octave>\d?)$/i;
        const match = string.match(pattern);
        if (!match?.groups) {
            throw new Error();
        }
        const letter = match.groups.letter.toUpperCase();
        const symbol = match.groups.symbol;
        const octave =
            match.groups.octave !== ''
                ? parseInt(match.groups.octave)
                : undefined;
        if (!isLetter(letter)) {
            throw new Error();
        }
        return new Note(
            letter,
            allSymbols.find((x) => x.sign === symbol),
            octave
        );
    }

    getIndex() {
        return (
            this.octave * 12 +
            getLetterIndices().find((x) => x.letter === this.letter)!.index +
            this.symbol.shift
        );
    }

    format(showOctave: boolean = true) {
        let result: string = this.letter + this.symbol;
        if (showOctave) {
            result += this.octave;
        }
        return result;
    }
}
