import { Interval } from '../interval';
import { Chord } from './Chord';

export class AugmentedChord extends Chord {
    name = 'Augmented';
    shortName = 'aug';
    intervals = [
        new Interval('Unison', 'Perfect'),
        new Interval('Third', 'Major'),
        new Interval('Fifth', 'Augmented'),
    ];
}
