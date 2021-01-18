import { Interval } from '../interval/Interval';
import { Chord } from './Chord';

export class MajorChord extends Chord {
    name: string = 'Major';
    shortName: string = '';
    intervals: Interval[] = [
        new Interval('Unison', 'Perfect'),
        new Interval('Third', 'Major'),
        new Interval('Fifth', 'Perfect'),
    ];
}
