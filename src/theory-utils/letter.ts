export type Letter = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';

export function isLetterChar(value: string): value is Letter {
    return ['C', 'D', 'E', 'F', 'G', 'A', 'B'].includes(value);
}

export const letterSchemas: {
    [K in Letter]: {
        index: number;
    };
} = {
    C: {
        index: 0,
    },
    D: {
        index: 2,
    },
    E: {
        index: 4,
    },
    F: {
        index: 5,
    },
    G: {
        index: 7,
    },
    A: {
        index: 9,
    },
    B: {
        index: 11,
    },
};
