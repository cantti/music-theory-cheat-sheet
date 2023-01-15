import { Chord } from '../chords';
import { Note } from '../notes';
import { getNotesByIntervals } from '../utils/getNotesByIntervals';
import { ScaleName } from './ScaleName';
import { scaleSchemas } from './scaleSchemas';

export class Scale {
    constructor(public tonic: Note, public readonly name: ScaleName) {}

    get shortName() {
        return scaleSchemas[this.name].shortName;
    }

    get notes() {
        return getNotesByIntervals(this.tonic, this.intervals);
    }

    get intervals() {
        return scaleSchemas[this.name].intervals;
    }

    get chords() {
        return this.notes
            .slice(0, 7)
            .map((note, index) =>
                scaleSchemas[this.name].chords[index].map(
                    (chordName) => new Chord(note, chordName)
                )
            );
    }

    format(kind: 'short' | 'long' = 'long', showOctave: boolean = false) {
        if (kind === 'short') {
            return this.tonic.format(showOctave) + this.shortName;
        } else {
            return this.tonic.format(showOctave) + ' ' + this.name;
        }
    }
}
