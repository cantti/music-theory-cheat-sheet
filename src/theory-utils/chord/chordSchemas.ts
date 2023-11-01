import { ChordName } from '.';
import { Interval, interval } from '../interval';

type ChordSchema = {
    shortName: string;
    intervals: Interval[];
};

type ChordSchemas = {
    [K in ChordName]: ChordSchema;
};

export const chordSchemas: ChordSchemas = {
    Minor: {
        shortName: 'm',
        intervals: [interval('Third', 'Minor'), interval('Fifth', 'Perfect')],
    },
    Major: {
        shortName: '',
        intervals: [interval('Third', 'Major'), interval('Fifth', 'Perfect')],
    },
    Diminished: {
        shortName: 'dim',
        intervals: [
            interval('Third', 'Minor'),
            interval('Fifth', 'Diminished'),
        ],
    },
    Augmented: {
        shortName: 'aug',
        intervals: [interval('Third', 'Major'), interval('Fifth', 'Augmented')],
    },
};
