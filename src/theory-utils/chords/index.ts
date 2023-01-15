import { Note } from '../notes';
import { AugmentedChord } from './AugmentedChord';
import { Chord } from './Chord';
import { ChordName } from './ChordName';
import { DiminishedChord } from './DiminishedChord';
import { MajorChord } from './MajorChord';
import { MinorChord } from './MinorChord';

function createChord(note: Note, chordName: ChordName): Chord {
    switch (chordName) {
        case 'Major':
            return new MajorChord(note);
        case 'Minor':
            return new MinorChord(note);
        case 'Diminished':
            return new DiminishedChord(note);
        case 'Augmented':
            return new AugmentedChord(note);
        default:
            throw new Error();
    }
}

export type { ChordName };

export {
    Chord,
    MinorChord,
    MajorChord,
    DiminishedChord,
    AugmentedChord,
    createChord,
};
