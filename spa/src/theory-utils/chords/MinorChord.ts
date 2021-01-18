import { Interval } from '../interval/Interval';
import { Chord } from './Chord';

export class MinorChord extends Chord {
    name: string = 'Minor';
    shortName: string = 'm';
    intervals: Interval[] = [
        new Interval('Unison', 'Perfect'),
        new Interval('Third', 'Minor'),
        new Interval('Fifth', 'Perfect'),
    ];
}
