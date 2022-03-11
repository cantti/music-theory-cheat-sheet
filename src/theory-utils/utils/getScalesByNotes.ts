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
    new MajorScale(new Note('G', 'Flat')),
    new MajorScale(new Note('D', 'Flat')),
    new MajorScale(new Note('A', 'Flat')),
    new MajorScale(new Note('E', 'Flat')),
    new MajorScale(new Note('B', 'Flat')),
    new MajorScale(new Note('F')),
    new NaturalMinorScale(new Note('A')),
    new NaturalMinorScale(new Note('E')),
    new NaturalMinorScale(new Note('B')),
    new NaturalMinorScale(new Note('F', 'Sharp')),
    new NaturalMinorScale(new Note('C', 'Sharp')),
    new NaturalMinorScale(new Note('G', 'Sharp')),
    new NaturalMinorScale(new Note('E', 'Flat')),
    new NaturalMinorScale(new Note('B', 'Flat')),
    new NaturalMinorScale(new Note('F')),
    new NaturalMinorScale(new Note('C')),
    new NaturalMinorScale(new Note('G')),
    new NaturalMinorScale(new Note('D')),
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
