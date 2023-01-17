import { accidentalSchemas } from './accidentalSchemas';
import { AccidentalSign } from './AccidentalSign';

export class Accidental {
    constructor(public sign: AccidentalSign) {}

    get shift() {
        return accidentalSchemas[this.sign].index;
    }

    toString() {
        return this.sign;
    }
    equals(other: Accidental) {
        return this.sign === other.sign;
    }
}
