import { Interval } from '../interval/Interval';
import { Chord } from './Chord';

export class MinorChord extends Chord {
    name = 'Minor';
    shortName = 'm';
    intervals = [
        new Interval('Unison', 'Perfect'),
        new Interval('Third', 'Minor'),
        new Interval('Fifth', 'Perfect'),
    ];
}
