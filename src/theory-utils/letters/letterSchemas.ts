import { LetterChar } from './LetterChar';

type LetterSchema = {
    index: number;
};

type LetterSchemas = {
    [K in LetterChar]: LetterSchema;
};

export const letterSchemas: LetterSchemas = {
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
