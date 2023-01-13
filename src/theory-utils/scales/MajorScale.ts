import { DiminishedChord } from '../chords/DiminishedChord';
import { MajorChord } from '../chords/MajorChord';
import { MinorChord } from '../chords/MinorChord';
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
    get chords() {
        return [
            [new MajorChord(this.notes[0])],
            [new MinorChord(this.notes[1])],
            [new MinorChord(this.notes[2])],
            [new MajorChord(this.notes[3])],
            [new MajorChord(this.notes[4])],
            [new MinorChord(this.notes[5])],
            [new DiminishedChord(this.notes[6])],
        ];
    }
}

export { MajorScale };
