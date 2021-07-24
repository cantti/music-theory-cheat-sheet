import { Interval } from '../interval/Interval';
import { Chord } from './Chord';

export class DiminishedChord extends Chord {
    getName = () => 'Diminished';
    getShortName = () => 'dim';
    getIntervals = () => [
        new Interval('Unison', 'Perfect'),
        new Interval('Third', 'Minor'),
        new Interval('Fifth', 'Diminished'),
    ];
}
