import { DiminishedChord } from '../chords/DiminishedChord';
import { MajorChord } from '../chords/MajorChord';
import { MinorChord } from '../chords/MinorChord';
import { Interval } from '../interval/Interval';
import { Scale } from './Scale';

class NaturalMinorScale extends Scale {
    name = 'Natural Minor';
    shortName = 'm';
    intervals = [
        new Interval('Unison', 'Perfect'),
        new Interval('Second', 'Major'),
        new Interval('Third', 'Minor'),
        new Interval('Fourth', 'Perfect'),
        new Interval('Fifth', 'Perfect'),
        new Interval('Sixth', 'Minor'),
        new Interval('Seventh', 'Minor'),
        new Interval('Octave', 'Perfect'),
    ];
    get chords() {
        return [
            [new MinorChord(this.notes[0])],
            [new DiminishedChord(this.notes[1])],
            [new MajorChord(this.notes[2])],
            [new MinorChord(this.notes[3])],
            [new MinorChord(this.notes[4])],
            [new MajorChord(this.notes[5])],
            [new MajorChord(this.notes[6])],
        ];
    }
}

export { NaturalMinorScale };
