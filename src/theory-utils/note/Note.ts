import { getLetterIndices } from '../utils/getLetterIndices';
import { getSymbolShifts } from '../utils/getSymbolShifts';
import { isLetter } from '../utils/isLetter';
import { isSymbol } from '../utils/isSymbol';
import { Letter } from './Letter';
import { Symbol } from './Symbol';

export class Note {
    constructor(
        public letter: Letter = 'C',
        public symbol: Symbol = '',
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
        if (!isLetter(letter) || !isSymbol(symbol)) {
            throw new Error();
        }
        return new Note(letter, symbol, octave);
    }

    getIndex() {
        return (
            this.octave * 12 +
            getLetterIndices().find((x) => x.letter === this.letter)!.index +
            getSymbolShifts().find((x) => x.symbol === this.symbol)!.shift
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
