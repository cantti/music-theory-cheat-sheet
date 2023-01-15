import _ from 'lodash';
import { Note } from '../notes';
import { createScale } from '../scales';
import { Scale } from '../scales/Scale';

const allScales: Scale[] = [
    createScale(new Note('C'), 'Major'),
    createScale(new Note('G'), 'Major'),
    createScale(new Note('D'), 'Major'),
    createScale(new Note('A'), 'Major'),
    createScale(new Note('E'), 'Major'),
    createScale(new Note('B'), 'Major'),
    createScale(new Note('G', 'b'), 'Major'),
    createScale(new Note('D', 'b'), 'Major'),
    createScale(new Note('A', 'b'), 'Major'),
    createScale(new Note('E', 'b'), 'Major'),
    createScale(new Note('B', 'b'), 'Major'),
    createScale(new Note('F'), 'Major'),
    createScale(new Note('A'), 'Natural Minor'),
    createScale(new Note('E'), 'Natural Minor'),
    createScale(new Note('B'), 'Natural Minor'),
    createScale(new Note('F', '#'), 'Natural Minor'),
    createScale(new Note('C', '#'), 'Natural Minor'),
    createScale(new Note('G', '#'), 'Natural Minor'),
    createScale(new Note('E', 'b'), 'Natural Minor'),
    createScale(new Note('B', 'b'), 'Natural Minor'),
    createScale(new Note('F'), 'Natural Minor'),
    createScale(new Note('C'), 'Natural Minor'),
    createScale(new Note('G'), 'Natural Minor'),
    createScale(new Note('D'), 'Natural Minor'),
];

export const getScalesByNotes = (notes: Note[]) => {
    const notesIndexes = _(notes)
        .map((x) => x.index % 12)
        .uniq()
        .value();

    return allScales.filter(
        (scale) =>
            _.intersection(
                scale.notes.map((note) => note.index % 12),
                notesIndexes
            ).length === notesIndexes.length
    );
};
