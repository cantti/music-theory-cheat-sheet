import { Interval } from '../interval/Interval';
import { Chord } from './Chord';

export class MajorChord extends Chord {
    getName() {
        return 'Major';
    };
    getShortName() {
        return '';
    };
    getIntervals() {
        return [
            new Interval('Unison', 'Perfect'),
            new Interval('Third', 'Major'),
            new Interval('Fifth', 'Perfect'),
        ];
    };
}
