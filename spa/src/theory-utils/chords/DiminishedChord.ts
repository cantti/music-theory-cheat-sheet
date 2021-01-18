import { Interval } from '../interval/Interval';
import { Chord } from './Chord';

export class DiminishedChord extends Chord {
    name: string = 'Diminished';
    shortName: string = 'dim';
    intervals: Interval[] = [
        { name: 'Unison', quality: 'Perfect' },
        { name: 'Third', quality: 'Minor' },
        { name: 'Fifth', quality: 'Diminished' },
    ];
}
