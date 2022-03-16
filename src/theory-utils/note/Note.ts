import { getLetterIndices } from '../utils/getLetterIndices';
import { getSymbolShifts } from '../utils/getSymbolShifts';
import { Letter } from './Letter';
import { Symbol } from './Symbol';

export class Note {
    constructor(
        public letter: Letter = 'C',
        public symbol: Symbol = 'None',
        public octave: number = 0
    ) {}

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
