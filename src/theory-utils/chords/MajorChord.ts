import { Interval } from '../interval/Interval';
import { Chord } from './Chord';

export class MajorChord extends Chord {
    getName = () => 'Major';
    getShortName = () => '';
    getIntervals = () => [
        new Interval('Unison', 'Perfect'),
        new Interval('Third', 'Major'),
        new Interval('Fifth', 'Perfect'),
    ];
}
