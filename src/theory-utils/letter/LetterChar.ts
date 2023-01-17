export type LetterChar = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';

export function isLetterChar(value: string): value is LetterChar {
    return ['C', 'D', 'E', 'F', 'G', 'A', 'B'].includes(value);
}
