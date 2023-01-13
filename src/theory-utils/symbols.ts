export abstract class Symbol {
    abstract readonly sign: string;
    abstract readonly shift: number;
    toString() {
        return this.sign;
    }
    equals(other: Symbol) {
        return this.sign === other.sign;
    }
}

export class Sharp extends Symbol {
    sign = '#';
    shift = 1;
}

export class DoubleSharp extends Symbol {
    sign = '##';
    shift = 2;
}

export class Flat extends Symbol {
    sign = 'b';
    shift = -1;
}

export class DoubleFlat extends Symbol {
    sign = 'bb';
    shift = -2;
}

export class None extends Symbol {
    sign = '';
    shift = 0;
}

const none = new None();
const sharp = new Sharp();
const doubleSharp = new DoubleSharp();
const flat = new Flat();
const doubleFlat = new DoubleFlat();

export const allSymbols = [sharp, doubleSharp, flat, doubleFlat, none];
