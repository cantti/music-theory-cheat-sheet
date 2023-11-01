import { ChordName } from '../chord';
import { Interval } from '../interval';
import { ScaleName } from './ScaleName';

type ScaleSchema = {
    shortName: string;
    intervals: Interval[];
    chords: ChordName[][];
};

type ScaleSchemas = {
    [K in ScaleName]: ScaleSchema;
};

const major: ScaleSchema = {
    shortName: '',
    intervals: [
        new Interval('Second', 'Major'),
        new Interval('Third', 'Major'),
        new Interval('Fourth', 'Perfect'),
        new Interval('Fifth', 'Perfect'),
        new Interval('Sixth', 'Major'),
        new Interval('Seventh', 'Major'),
    ],
    chords: [
        ['Major'],
        ['Minor'],
        ['Minor'],
        ['Major'],
        ['Major'],
        ['Minor'],
        ['Diminished'],
    ],
};

const naturalMinor: ScaleSchema = {
    shortName: 'm',
    intervals: [
        new Interval('Second', 'Major'),
        new Interval('Third', 'Minor'),
        new Interval('Fourth', 'Perfect'),
        new Interval('Fifth', 'Perfect'),
        new Interval('Sixth', 'Minor'),
        new Interval('Seventh', 'Minor'),
    ],
    chords: [
        ['Minor'],
        ['Diminished'],
        ['Major'],
        ['Minor'],
        ['Minor'],
        ['Major'],
        ['Major'],
    ],
};

const harmonicMinor: ScaleSchema = {
    shortName: '',
    intervals: [
        new Interval('Second', 'Major'),
        new Interval('Third', 'Minor'),
        new Interval('Fourth', 'Perfect'),
        new Interval('Fifth', 'Perfect'),
        new Interval('Sixth', 'Minor'),
        new Interval('Seventh', 'Major'),
    ],
    chords: [
        ['Minor'],
        ['Diminished'],
        ['Augmented'],
        ['Minor'],
        ['Major'],
        ['Major'],
        ['Diminished'],
    ],
};

const melodicMinor: ScaleSchema = {
    shortName: '',
    intervals: [
        new Interval('Second', 'Major'),
        new Interval('Third', 'Minor'),
        new Interval('Fourth', 'Perfect'),
        new Interval('Fifth', 'Perfect'),
        new Interval('Sixth', 'Major'),
        new Interval('Seventh', 'Major'),
    ],
    chords: [
        ['Minor'],
        ['Minor'],
        ['Augmented'],
        ['Major'],
        ['Major'],
        ['Diminished'],
        ['Diminished'],
    ],
};

const majorPentatonic: ScaleSchema = {
    shortName: '',
    intervals: [
        new Interval('Second', 'Major'),
        new Interval('Third', 'Major'),
        new Interval('Fifth', 'Perfect'),
        new Interval('Sixth', 'Major'),
    ],
    chords: [],
};

const minorPentatonic: ScaleSchema = {
    shortName: '',
    intervals: [
        new Interval('Third', 'Minor'),
        new Interval('Fourth', 'Perfect'),
        new Interval('Fifth', 'Perfect'),
        new Interval('Seventh', 'Minor'),
    ],
    chords: [],
};

export const scaleSchemas: ScaleSchemas = {
    Major: major,
    'Natural Minor': naturalMinor,
    'Harmonic Minor': harmonicMinor,
    'Melodic Minor': melodicMinor,
    'Major Pentatonic': majorPentatonic,
    'Minor Pentatonic': minorPentatonic,
};
