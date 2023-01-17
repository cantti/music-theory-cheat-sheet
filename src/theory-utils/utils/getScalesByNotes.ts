import _ from 'lodash';
import { Note } from '../note';
import { Scale } from '../scale/Scale';

const allScales: Scale[] = [
    new Scale(new Note('C'), 'Major'),
    new Scale(new Note('G'), 'Major'),
    new Scale(new Note('D'), 'Major'),
    new Scale(new Note('A'), 'Major'),
    new Scale(new Note('E'), 'Major'),
    new Scale(new Note('B'), 'Major'),
    new Scale(new Note('G', 'b'), 'Major'),
    new Scale(new Note('D', 'b'), 'Major'),
    new Scale(new Note('A', 'b'), 'Major'),
    new Scale(new Note('E', 'b'), 'Major'),
    new Scale(new Note('B', 'b'), 'Major'),
    new Scale(new Note('F'), 'Major'),
    new Scale(new Note('A'), 'Natural Minor'),
    new Scale(new Note('E'), 'Natural Minor'),
    new Scale(new Note('B'), 'Natural Minor'),
    new Scale(new Note('F', '#'), 'Natural Minor'),
    new Scale(new Note('C', '#'), 'Natural Minor'),
    new Scale(new Note('G', '#'), 'Natural Minor'),
    new Scale(new Note('E', 'b'), 'Natural Minor'),
    new Scale(new Note('B', 'b'), 'Natural Minor'),
    new Scale(new Note('F'), 'Natural Minor'),
    new Scale(new Note('C'), 'Natural Minor'),
    new Scale(new Note('G'), 'Natural Minor'),
    new Scale(new Note('D'), 'Natural Minor'),
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
