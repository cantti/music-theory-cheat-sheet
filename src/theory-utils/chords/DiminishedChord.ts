import { Interval } from '../interval/Interval';
import { Chord } from './Chord';

export class DiminishedChord extends Chord {
    getName() {
        return 'Diminished';
    };
    getShortName() {
        return 'dim';
    };
    getIntervals() {
        return [
            new Interval('Unison', 'Perfect'),
            new Interval('Third', 'Minor'),
            new Interval('Fifth', 'Diminished'),
        ];
    };
}
