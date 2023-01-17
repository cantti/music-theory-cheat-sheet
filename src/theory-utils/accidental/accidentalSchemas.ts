import { AccidentalSign } from './AccidentalSign';

type AccidentalSchema = {
    index: number;
};

type AccidentalSchemas = {
    [K in AccidentalSign]: AccidentalSchema;
};

export const accidentalSchemas: AccidentalSchemas = {
    '': {
        index: 0,
    },
    '#': {
        index: 1,
    },
    '##': {
        index: 2,
    },
    b: {
        index: -1,
    },
    bb: {
        index: -2,
    },
};
