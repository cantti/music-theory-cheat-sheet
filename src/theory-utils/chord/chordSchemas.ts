import { Interval } from '../interval';
import { ChordName } from './ChordName';

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
        intervals: [
            new Interval('Unison', 'Perfect'),
            new Interval('Third', 'Minor'),
            new Interval('Fifth', 'Perfect'),
        ],
    },
    Major: {
        shortName: '',
        intervals: [
            new Interval('Unison', 'Perfect'),
            new Interval('Third', 'Major'),
            new Interval('Fifth', 'Perfect'),
        ],
    },
    Diminished: {
        shortName: 'dim',
        intervals: [
            new Interval('Unison', 'Perfect'),
            new Interval('Third', 'Minor'),
            new Interval('Fifth', 'Diminished'),
        ],
    },
    Augmented: {
        shortName: 'aug',
        intervals: [
            new Interval('Unison', 'Perfect'),
            new Interval('Third', 'Major'),
            new Interval('Fifth', 'Augmented'),
        ],
    },
};
