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

export class Sharp extends Accidental {
    sign = '#';
    shift = 1;
}

export class DoubleSharp extends Accidental {
    sign = '##';
    shift = 2;
}

export class Flat extends Accidental {
    sign = 'b';
    shift = -1;
}

export class DoubleFlat extends Accidental {
    sign = 'bb';
    shift = -2;
}

export class Natural extends Accidental {
    sign = '';
    shift = 0;
}

const natural = new Natural();
const sharp = new Sharp();
const doubleSharp = new DoubleSharp();
const flat = new Flat();
const doubleFlat = new DoubleFlat();

export const allAccidentals = [sharp, doubleSharp, flat, doubleFlat, natural];
