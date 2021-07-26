import { Symbol } from '../note/Symbol';

export function isSymbol(str: string): str is Symbol {
    return (
        str === 'None' ||
        str === 'Sharp' ||
        str === 'DoubleSharp' ||
        str === 'Flat' ||
        str === 'DoubleFlat'
    );
}
