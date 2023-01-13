import { Interval } from '../interval/Interval';
import { Chord } from './Chord';

export class DiminishedChord extends Chord {
    name = 'Diminished';
    shortName = 'dim';
    intervals = [
        new Interval('Unison', 'Perfect'),
        new Interval('Third', 'Minor'),
        new Interval('Fifth', 'Diminished'),
    ];
}
