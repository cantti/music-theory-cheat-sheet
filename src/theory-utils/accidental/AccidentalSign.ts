export type AccidentalSign = '' | '#' | '##' | 'b' | 'bb';

export function isAccidentalSign(value: string): value is AccidentalSign {
    return ['', '#', '##', 'b', 'bb'].includes(value);
}
