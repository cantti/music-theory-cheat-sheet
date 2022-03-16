import { getLetterIndices } from '../utils/getLetterIndices';
import { getSymbolShifts } from '../utils/getSymbolShifts';
import { Letter } from './Letter';
import { Symbol } from './Symbol';

export class Note {
    constructor(
        public letter: Letter = 'C',
        public symbol: Symbol = '',
        public octave: number = 4
    ) {}

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
