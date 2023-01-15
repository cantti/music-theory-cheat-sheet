import { createChord } from '../chords';
import { Interval } from '../interval';
import { Scale } from './Scale';
import { ScaleName } from './ScaleName';

class NaturalMinorScale extends Scale {
    name: ScaleName = 'Natural Minor';
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
            [createChord(this.notes[0], 'Minor')],
            [createChord(this.notes[1], 'Diminished')],
            [createChord(this.notes[2], 'Major')],
            [createChord(this.notes[3], 'Minor')],
            [createChord(this.notes[4], 'Minor')],
            [createChord(this.notes[5], 'Major')],
            [createChord(this.notes[6], 'Major')],
        ];
    }
}

export { NaturalMinorScale };
