import { Accidental } from './Accidental';
import { AccidentalSign } from './AccidentalSign';

class Natural extends Accidental {
    sign: AccidentalSign = '';
    shift = 0;
}

class Sharp extends Accidental {
    sign: AccidentalSign = '#';
    shift = 1;
}

class DoubleSharp extends Accidental {
    sign: AccidentalSign = '##';
    shift = 2;
}

class Flat extends Accidental {
    sign: AccidentalSign = 'b';
    shift = -1;
}

class DoubleFlat extends Accidental {
    sign: AccidentalSign = 'bb';
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
