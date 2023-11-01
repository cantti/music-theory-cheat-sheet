import _ from 'lodash';
import { Note, n } from './note';
import { Scale } from './scale';

const allScales: Scale[] = [
    new Scale(n('C'), 'Major'),
    new Scale(n('G'), 'Major'),
    new Scale(n('D'), 'Major'),
    new Scale(n('A'), 'Major'),
    new Scale(n('E'), 'Major'),
    new Scale(n('B'), 'Major'),
    new Scale(n('G', 'b'), 'Major'),
    new Scale(n('D', 'b'), 'Major'),
    new Scale(n('A', 'b'), 'Major'),
    new Scale(n('E', 'b'), 'Major'),
    new Scale(n('B', 'b'), 'Major'),
    new Scale(n('F'), 'Major'),
    new Scale(n('A'), 'Natural Minor'),
    new Scale(n('E'), 'Natural Minor'),
    new Scale(n('B'), 'Natural Minor'),
    new Scale(n('F', '#'), 'Natural Minor'),
    new Scale(n('C', '#'), 'Natural Minor'),
    new Scale(n('G', '#'), 'Natural Minor'),
    new Scale(n('E', 'b'), 'Natural Minor'),
    new Scale(n('B', 'b'), 'Natural Minor'),
    new Scale(n('F'), 'Natural Minor'),
    new Scale(n('C'), 'Natural Minor'),
    new Scale(n('G'), 'Natural Minor'),
    new Scale(n('D'), 'Natural Minor'),
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
