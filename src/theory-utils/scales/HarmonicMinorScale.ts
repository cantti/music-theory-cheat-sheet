import { createChord } from '../chords';
import { Interval } from '../interval';
import { Scale } from './Scale';
import { ScaleName } from './ScaleName';

class HarmonicMinorScale extends Scale {
    name: ScaleName = 'Harmonic Minor';
    shortName = '';
    intervals = [
        new Interval('Unison', 'Perfect'),
        new Interval('Second', 'Major'),
        new Interval('Third', 'Minor'),
        new Interval('Fourth', 'Perfect'),
        new Interval('Fifth', 'Perfect'),
        new Interval('Sixth', 'Minor'),
        new Interval('Seventh', 'Major'),
        new Interval('Octave', 'Perfect'),
    ];
    get chords() {
        return [
            [createChord(this.notes[0], 'Minor')],
            [createChord(this.notes[1], 'Diminished')],
            [createChord(this.notes[2], 'Augmented')],
            [createChord(this.notes[3], 'Minor')],
            [createChord(this.notes[4], 'Major')],
            [createChord(this.notes[5], 'Major')],
            [createChord(this.notes[6], 'Diminished')],
        ];
    }
}

export { HarmonicMinorScale };
