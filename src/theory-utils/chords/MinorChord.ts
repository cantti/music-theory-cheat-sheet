import { Interval } from '../interval/Interval';
import { Chord } from './Chord';

export class MinorChord extends Chord {
    _name: string = 'Minor';
    _shortName: string = 'm';
    _intervals: Interval[] = [
        new Interval('Unison', 'Perfect'),
        new Interval('Third', 'Minor'),
        new Interval('Fifth', 'Perfect'),
    ];
}
