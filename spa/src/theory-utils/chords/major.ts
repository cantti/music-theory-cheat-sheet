import { Chord } from '../types/Chord';

export const createMajor = (): Chord => ({
    name: 'Major',
    shortName: '',
    intervals: [
        { name: 'Unison', quality: 'Perfect' },
        { name: 'Third', quality: 'Major' },
        { name: 'Fifth', quality: 'Perfect' },
    ],
});
