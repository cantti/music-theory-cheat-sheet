import _ from 'lodash';
import { Note } from '../note/Note';
import { MajorScale } from '../scales/MajorScale';
import { NaturalMinorScale } from '../scales/NaturalMinorScale';
import { Scale } from '../scales/Scale';

const allScales: Scale[] = [
    new MajorScale(new Note('C')),
    new MajorScale(new Note('G')),
    new MajorScale(new Note('D')),
    new MajorScale(new Note('A')),
    new MajorScale(new Note('E')),
    new MajorScale(new Note('B')),
    new MajorScale(new Note('G', 'b')),
    new MajorScale(new Note('D', 'b')),
    new MajorScale(new Note('A', 'b')),
    new MajorScale(new Note('E', 'b')),
    new MajorScale(new Note('B', 'b')),
    new MajorScale(new Note('F')),
    new NaturalMinorScale(new Note('A')),
    new NaturalMinorScale(new Note('E')),
    new NaturalMinorScale(new Note('B')),
    new NaturalMinorScale(new Note('F', '#')),
    new NaturalMinorScale(new Note('C', '#')),
    new NaturalMinorScale(new Note('G', '#')),
    new NaturalMinorScale(new Note('E', 'b')),
    new NaturalMinorScale(new Note('B', 'b')),
    new NaturalMinorScale(new Note('F')),
    new NaturalMinorScale(new Note('C')),
    new NaturalMinorScale(new Note('G')),
    new NaturalMinorScale(new Note('D')),
];

export const getScalesByNotes = (notes: Note[]) => {
    const notesIndexes = _(notes)
        .map((x) => x.getIndex() % 12)
        .uniq()
        .value();

    return allScales.filter(
        (scale) =>
            _.intersection(
                scale.notes.map((note) => note.getIndex() % 12),
                notesIndexes
            ).length === notesIndexes.length
    );
};
