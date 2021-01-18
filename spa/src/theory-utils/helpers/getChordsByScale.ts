import { DiminishedChord } from "../chords/DiminishedChord";
import { MajorChord } from "../chords/MajorChord";
import { MinorChord } from "../chords/MinorChord";
import { MajorScale } from "../scales/MajorScale";
import { NaturalMinorScale } from "../scales/NaturalMinorScale";
import { Scale } from "../scales/Scale";

export const getChordsByScale = (scale: Scale) => {
    const notes = scale.getNotes();
    if (scale instanceof MajorScale) {
        return [
            [new MajorChord(notes[0])],
            [new MinorChord(notes[1])],
            [new MinorChord(notes[2])],
            [new MajorChord(notes[3])],
            [new MajorChord(notes[4])],
            [new MinorChord(notes[5])],
            [new DiminishedChord(notes[6])],
        ];
    } else if (scale instanceof NaturalMinorScale) {
        return [
            [new MinorChord(notes[0])],
            [new DiminishedChord(notes[1])],
            [new MajorChord(notes[2])],
            [new MinorChord(notes[3])],
            [new MinorChord(notes[4])],
            [new MajorChord(notes[5])],
            [new MajorChord(notes[6])],
        ];
    }
};
