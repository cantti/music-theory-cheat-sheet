import _ from 'lodash';
import { Note } from '../note/Note';
import { MajorScale } from '../scales/MajorScale';
import { NaturalMinorScale } from '../scales/NaturalMinorScale';
import { Scale } from '../scales/Scale';

const allScales: Scale[] = [
    new MajorScale(Note.fromString('C')),
    new MajorScale(Note.fromString('G')),
    new MajorScale(Note.fromString('D')),
    new MajorScale(Note.fromString('A')),
    new MajorScale(Note.fromString('E')),
    new MajorScale(Note.fromString('B')),
    new MajorScale(Note.fromString('Gb')),
    new MajorScale(Note.fromString('Db')),
    new MajorScale(Note.fromString('Ab')),
    new MajorScale(Note.fromString('Eb')),
    new MajorScale(Note.fromString('Bb')),
    new MajorScale(Note.fromString('F')),
    new NaturalMinorScale(Note.fromString('A')),
    new NaturalMinorScale(Note.fromString('E')),
    new NaturalMinorScale(Note.fromString('B')),
    new NaturalMinorScale(Note.fromString('F#')),
    new NaturalMinorScale(Note.fromString('C#')),
    new NaturalMinorScale(Note.fromString('G#')),
    new NaturalMinorScale(Note.fromString('Eb')),
    new NaturalMinorScale(Note.fromString('Bb')),
    new NaturalMinorScale(Note.fromString('F')),
    new NaturalMinorScale(Note.fromString('C')),
    new NaturalMinorScale(Note.fromString('G')),
    new NaturalMinorScale(Note.fromString('D')),
];

export const getScalesByNotes = (notes: Note[]) => {
    const notesIndexes = _(notes)
        .map((x) => x.getIndex())
        .uniq()
        .value();

    return allScales.filter(
        (scale) =>
            _.intersection(
                scale.getNotes().map((note) => note.getIndex() % 12),
                notesIndexes
            ).length === notesIndexes.length
    );
};
