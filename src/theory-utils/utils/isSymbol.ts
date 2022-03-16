import { Symbol } from '../note/Symbol';

export function isSymbol(str: string): str is Symbol {
    return (
        str === '#' || str === '##' || str === 'b' || str === 'bb' || str === ''
    );
}
