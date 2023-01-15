import { Note } from '../notes';
import { HarmonicMinorScale } from './HarmonicMinorScale';
import { MajorScale } from './MajorScale';
import { MelodicMinorScale } from './MelodicMinorScale';
import { NaturalMinorScale } from './NaturalMinorScale';
import { Scale } from './Scale';
import { ScaleName } from './ScaleName';

function createScale(note: Note, scaleName: ScaleName): Scale {
    switch (scaleName) {
        case 'Natural Minor':
            return new NaturalMinorScale(note);
        case 'Major':
            return new MajorScale(note);
        case 'Harmonic Minor':
            return new HarmonicMinorScale(note);
        case 'Melodic Minor':
            return new MelodicMinorScale(note);
        default:
            throw new Error('Wrong scale name');
    }
}

export type { ScaleName };

export {
    Scale,
    NaturalMinorScale,
    MajorScale,
    HarmonicMinorScale,
    createScale,
};
