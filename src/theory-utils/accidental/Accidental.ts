
export abstract class Accidental {
    abstract readonly sign: string;
    abstract readonly shift: number;
    toString() {
        return this.sign;
    }
    equals(other: Accidental) {
        return this.sign === other.sign;
    }
}


