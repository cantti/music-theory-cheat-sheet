import { Chord } from '../chords/Chord';
import { Interval } from '../interval/Interval';
import { Scale } from './Scale';

class MajorScale extends Scale {
    _name = 'Major';
    _shortName = '';
    _intervals = [
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
