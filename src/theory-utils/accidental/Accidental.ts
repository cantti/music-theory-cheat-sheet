import { AccidentalSign } from "./AccidentalSign";

export abstract class Accidental {
    abstract readonly sign: AccidentalSign;
    abstract readonly shift: number;
    toString() {
        return this.sign;
    }
    equals(other: Accidental) {
        return this.sign === other.sign;
    }
}


