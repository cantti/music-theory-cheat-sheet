import { LetterChar } from './LetterChar';
import { letterSchemas } from './letterSchemas';

export class Letter {
    constructor(public char: LetterChar) {}

    get index() {
        return letterSchemas[this.char].index;
    }

    toString() {
        return this.char;
    }

    equals(other: Letter) {
        return this.char === other.char;
    }
}
