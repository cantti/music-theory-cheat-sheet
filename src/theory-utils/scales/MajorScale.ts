import { createChord } from '../chords';
import { Interval } from '../interval';
import { Scale } from './Scale';
import { ScaleName } from './ScaleName';

class MajorScale extends Scale {
    name: ScaleName = 'Major';
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
            [createChord(this.notes[0], 'Major')],
            [createChord(this.notes[1], 'Minor')],
            [createChord(this.notes[2], 'Minor')],
            [createChord(this.notes[3], 'Major')],
            [createChord(this.notes[4], 'Major')],
            [createChord(this.notes[5], 'Minor')],
            [createChord(this.notes[6], 'Diminished')],
        ];
    }
}

export { MajorScale };
