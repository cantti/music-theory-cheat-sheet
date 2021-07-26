import { Letter } from '../note/Letter';

export function isLetter(str: string): str is Letter {
    return (
        str === 'C' ||
        str === 'D' ||
        str === 'E' ||
        str === 'F' ||
        str === 'G' ||
        str === 'A' ||
        str === 'B'
    );
}
