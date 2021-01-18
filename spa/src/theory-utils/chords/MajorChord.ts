import { Interval } from '../interval/Interval';
import { Chord } from './Chord';

export class MajorChord extends Chord {
    _name: string = 'Major';
    _shortName: string = '';
    _intervals: Interval[] = [
        new Interval('Unison', 'Perfect'),
        new Interval('Third', 'Major'),
        new Interval('Fifth', 'Perfect'),
    ];
}
