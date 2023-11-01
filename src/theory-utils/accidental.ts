export type Accidental = '' | '#' | '##' | 'b' | 'bb';

export function isAccidental(value: string): value is Accidental {
    return ['', '#', '##', 'b', 'bb'].includes(value);
}

export const accidentalSchemas: {
    [K in Accidental]: {
        shift: number;
    };
} = {
    '': {
        shift: 0,
    },
    '#': {
        shift: 1,
    },
    '##': {
        shift: 2,
    },
    b: {
        shift: -1,
    },
    bb: {
        shift: -2,
    },
};
