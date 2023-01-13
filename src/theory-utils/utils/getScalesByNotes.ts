import _ from 'lodash';
import { Note } from '../notes';
import { MajorScale } from '../scales/MajorScale';
import { NaturalMinorScale } from '../scales/NaturalMinorScale';
import { Scale } from '../scales/Scale';

const allScales: Scale[] = [
    MajorScale.create('C'),
    MajorScale.create('G'),
    MajorScale.create('D'),
    MajorScale.create('A'),
    MajorScale.create('E'),
    MajorScale.create('B'),
    MajorScale.create('Gb'),
    MajorScale.create('Db'),
    MajorScale.create('Ab'),
    MajorScale.create('Eb'),
    MajorScale.create('Bb'),
    MajorScale.create('F'),
    NaturalMinorScale.create('A'),
    NaturalMinorScale.create('E'),
    NaturalMinorScale.create('B'),
    NaturalMinorScale.create('F#'),
    NaturalMinorScale.create('C#'),
    NaturalMinorScale.create('G#'),
    NaturalMinorScale.create('Eb'),
    NaturalMinorScale.create('Bb'),
    NaturalMinorScale.create('F'),
    NaturalMinorScale.create('C'),
    NaturalMinorScale.create('G'),
    NaturalMinorScale.create('D'),
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
