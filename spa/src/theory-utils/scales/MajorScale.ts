import { Chord } from '../chords/Chord';
import { Interval } from '../interval/Interval';
import { Scale } from './Scale';

class MajorScale extends Scale {
    name: string = 'Major';
    shortName: string = '';
    intervals: Interval[] = [
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
