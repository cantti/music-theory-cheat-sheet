import { getLetterIndices } from '../helpers/getLetterIndices';
import { getSymbolShifts } from '../helpers/getSymbolShifts';
import { Letter } from './Letter';
import { Symbol } from './Symbol';

export class Note {
    constructor(
        public letter: Letter = 'C',
        public symbol: Symbol = 'None',
        public octave: number = 0
    ) {}

    static fromString(parse: string) {
        let note: Note = new Note('C', 'None', 0);
        switch (parse[0].toUpperCase()) {
            case 'C':
                note.letter = 'C';
                break;
            case 'D':
                note.letter = 'D';
                break;
            case 'E':
                note.letter = 'E';
                break;
            case 'F':
                note.letter = 'F';
                break;
            case 'G':
                note.letter = 'G';
                break;
            case 'A':
                note.letter = 'A';
                break;
            case 'B':
                note.letter = 'B';
                break;
            default:
                throw new Error();
        }
        if (parse.length > 1) {
            switch (parse[1]) {
                case '#':
                    note.symbol = 'Sharp';
                    break;
                case '##':
                    note.symbol = 'DoubleSharp';
                    break;
                case 'b':
                    note.symbol = 'Flat';
                    break;
                case 'bb':
                    note.symbol = 'DoubleFlat';
                    break;
                default:
                    break;
            }
        }
        return note;
    }

    getIndex() {
        return (
            this.octave * 12 +
            getLetterIndices().find((x) => x.letter === this.letter)!.index +
            getSymbolShifts().find((x) => x.symbol === this.symbol)!.shift
        );
    }

    format() {
        let result: string = this.letter;
        switch (this.symbol) {
            case 'Sharp':
                result += '#';
                break;
            case 'DoubleSharp':
                result += '##';
                break;
            case 'Flat':
                result += 'b';
                break;
            case 'DoubleFlat':
                result += 'bb';
                break;
            default:
                break;
        }
        return result;
    }
}
