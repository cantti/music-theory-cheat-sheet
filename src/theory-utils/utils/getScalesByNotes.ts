import _ from 'lodash';
import { C, D, E, F, G, A, B } from '../letters';
import { Note } from '../notes';
import { MajorScale } from '../scales/MajorScale';
import { NaturalMinorScale } from '../scales/NaturalMinorScale';
import { Scale } from '../scales/Scale';
import { Flat, Sharp } from '../symbols';

const allScales: Scale[] = [
    new MajorScale(new Note(new C())),
    new MajorScale(new Note(new G())),
    new MajorScale(new Note(new D())),
    new MajorScale(new Note(new A())),
    new MajorScale(new Note(new E())),
    new MajorScale(new Note(new B())),
    new MajorScale(new Note(new G(), new Flat())),
    new MajorScale(new Note(new D(), new Flat())),
    new MajorScale(new Note(new A(), new Flat())),
    new MajorScale(new Note(new E(), new Flat())),
    new MajorScale(new Note(new B(), new Flat())),
    new MajorScale(new Note(new F())),
    new NaturalMinorScale(new Note(new A())),
    new NaturalMinorScale(new Note(new E())),
    new NaturalMinorScale(new Note(new B())),
    new NaturalMinorScale(new Note(new F(), new Sharp())),
    new NaturalMinorScale(new Note(new C(), new Sharp())),
    new NaturalMinorScale(new Note(new G(), new Sharp())),
    new NaturalMinorScale(new Note(new E(), new Flat())),
    new NaturalMinorScale(new Note(new B(), new Flat())),
    new NaturalMinorScale(new Note(new F())),
    new NaturalMinorScale(new Note(new C())),
    new NaturalMinorScale(new Note(new G())),
    new NaturalMinorScale(new Note(new D())),
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
