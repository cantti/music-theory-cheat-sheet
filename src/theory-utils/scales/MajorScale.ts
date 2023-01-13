import { Interval } from '../interval/Interval';
import { Scale } from './Scale';

class MajorScale extends Scale {
    name = 'Major';
    shortName = '';
    intervals = [
        new Interval('Unison', 'Perfect'),
        new Interval('Second', 'Major'),
        new Interval('Third', 'Major'),
        new Interval('Fourth', 'Perfect'),
        new Interval('Fifth', 'Perfect'),
        new Interval('Sixth', 'Major'),
        new Interval('Seventh', 'Major'),
        new Interval('Octave', 'Perfect'),
    ];
}

export { MajorScale };
