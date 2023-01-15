import { Accidental } from './Accidental';
import { AccidentalSign } from './AccidentalSign';

class Natural extends Accidental {
    sign = '';
    shift = 0;
}

class Sharp extends Accidental {
    sign = '#';
    shift = 1;
}

class DoubleSharp extends Accidental {
    sign = '##';
    shift = 2;
}

class Flat extends Accidental {
    sign = 'b';
    shift = -1;
}

class DoubleFlat extends Accidental {
    sign = 'bb';
    shift = -2;
}

function createAccidental(sign: AccidentalSign): Accidental {
    switch (sign) {
        case '':
            return new Natural();
        case '#':
            return new Sharp();
        case '##':
            return new DoubleSharp();
        case 'b':
            return new Flat();
        case 'bb':
            return new DoubleFlat();
        default:
            throw new Error();
    }
}

export type { AccidentalSign };

export {
    Accidental,
    Natural,
    Sharp,
    DoubleSharp,
    Flat,
    DoubleFlat,
    createAccidental,
};
