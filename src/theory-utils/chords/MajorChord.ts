import { Interval } from '../interval';
import { Chord } from './Chord';

export class MajorChord extends Chord {
    name = 'Major';
    shortName = '';
    intervals = [
        new Interval('Unison', 'Perfect'),
        new Interval('Third', 'Major'),
        new Interval('Fifth', 'Perfect'),
    ];
}