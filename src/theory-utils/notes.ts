import { allSymbols, None, Symbol } from './symbols';
import { allLetters, C, Letter } from './letters';

export class Note {
    constructor(
        public letter: Letter = new C(),
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
        const symbol = match.groups.symbol.toLowerCase();
        const octave =
            match.groups.octave !== ''
                ? parseInt(match.groups.octave)
                : undefined;
        return new Note(
            allLetters.find((x) => x.char === letter),
            allSymbols.find((x) => x.sign === symbol),
            octave
        );
    }

    getIndex() {
        return this.octave * 12 + this.letter.index + this.symbol.shift;
    }

    format(showOctave: boolean = true) {
        let result: string = this.letter.toString() + this.symbol.toString();
        if (showOctave) {
            result += this.octave;
        }
        return result;
    }
}
