import { Interval } from '../interval/Interval';
import { Chord } from './Chord';

export class MinorChord extends Chord {
    getName() {
        return 'Minor';
    };
    getShortName() {
        return 'm';
    };
    getIntervals() {
        return [
            new Interval('Unison', 'Perfect'),
            new Interval('Third', 'Minor'),
            new Interval('Fifth', 'Perfect'),
        ];
    };
}
