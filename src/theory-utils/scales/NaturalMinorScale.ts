import { Interval } from '../interval/Interval';
import { Scale } from './Scale';

class NaturalMinorScale extends Scale {
    getName() {
        return 'Natural Minor';
    }
    getShortName() {
        return 'm';
    }
    getIntervals() {
        return [
            new Interval('Unison', 'Perfect'),
            new Interval('Second', 'Major'),
            new Interval('Third', 'Minor'),
            new Interval('Fourth', 'Perfect'),
            new Interval('Fifth', 'Perfect'),
            new Interval('Sixth', 'Minor'),
            new Interval('Seventh', 'Minor'),
            new Interval('Octave', 'Perfect'),
        ];
    }
}

export { NaturalMinorScale };
