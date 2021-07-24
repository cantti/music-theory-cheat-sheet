import { Interval } from '../interval/Interval';
import { Chord } from './Chord';

export class MinorChord extends Chord {
    getName = () => 'Minor';
    getShortName = () => 'm';
    getIntervals = () => [
        new Interval('Unison', 'Perfect'),
        new Interval('Third', 'Minor'),
        new Interval('Fifth', 'Perfect'),
    ];
}
