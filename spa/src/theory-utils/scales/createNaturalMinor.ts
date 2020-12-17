import { Scale } from '../types/Scale';

export const createNaturalMinor = (): Scale => ({
    name: 'Natural Minor',
    intervals: [
        {
            name: 'Unison',
            quality: 'Perfect',
        },
        {
            name: 'Second',
            quality: 'Major',
        },
        {
            name: 'Third',
            quality: 'Minor',
        },
        {
            name: 'Fourth',
            quality: 'Perfect',
        },
        {
            name: 'Fifth',
            quality: 'Perfect',
        },
        {
            name: 'Sixth',
            quality: 'Minor',
        },
        {
            name: 'Seventh',
            quality: 'Minor',
        },
        {
            name: 'Octave',
            quality: 'Perfect',
        },
    ],
});
