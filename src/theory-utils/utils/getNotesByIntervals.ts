import { Accidental, accidentalSchemas } from '../note/accidental';
import { Interval, IntervalNumber } from '../interval';
import { Note } from '../note';
import { Letter, letterSchemas } from '../note/letter';

const majorScaleSemitones: {
    interval: Interval;
    semitones: number;
}[] = [
    {
        interval: new Interval('Unison', 'Perfect'),
        semitones: 0,
    },
    {
        interval: new Interval('Second', 'Major'),
        semitones: 2,
    },
    {
        interval: new Interval('Third', 'Major'),
        semitones: 4,
    },
    {
        interval: new Interval('Fourth', 'Perfect'),
        semitones: 5,
    },
    {
        interval: new Interval('Fifth', 'Perfect'),
        semitones: 7,
    },
    {
        interval: new Interval('Sixth', 'Major'),
        semitones: 9,
    },
    {
        interval: new Interval('Seventh', 'Major'),
        semitones: 11,
    },
    {
        interval: new Interval('Octave', 'Perfect'),
        semitones: 12,
    },
];

function totalSemitonesByInterval(interval: Interval): number {
    const errorMessage: string = 'Invalid interval';
    const majorScaleInterval = majorScaleSemitones.filter(
        (x) => x.interval.name === interval.name
    )[0];
    if (interval.quality === 'Major' || interval.quality === 'Perfect') {
        return majorScaleInterval.semitones;
    }
    if (majorScaleInterval.interval.quality === 'Perfect') {
        switch (interval.quality) {
            case 'Diminished':
                return majorScaleInterval.semitones - 1;
            case 'Augmented':
                return majorScaleInterval.semitones + 1;
            default:
                throw new Error(errorMessage);
        }
    }
    //Major
    else {
        switch (interval.quality) {
            case 'Minor':
                return majorScaleInterval.semitones - 1;
            case 'Diminished':
                return majorScaleInterval.semitones - 2;
            case 'Augmented':
                return majorScaleInterval.semitones + 1;
            default:
                throw new Error(errorMessage);
        }
    }
}

export function getNotesByIntervals(
    root: Note,
    intervals: Array<Interval>
): Note[] {
    const sortedIntervals: IntervalNumber[] = [
        'Unison',
        'Second',
        'Third',
        'Fourth',
        'Fifth',
        'Sixth',
        'Seventh',
        'Octave',
    ];

    let result: Note[] = [];

    intervals.forEach((interval) => {
        const newNoteLetter: Letter = Object.keys(letterSchemas)[
            (Object.keys(letterSchemas).indexOf(root.letter) +
                sortedIntervals.indexOf(interval.name)) %
                Object.keys(letterSchemas).length
        ] as Letter;

        const newNoteOctave: number = Math.trunc(
            root.octave +
                (Object.keys(letterSchemas).indexOf(root.letter) +
                    sortedIntervals.indexOf(interval.name)) /
                    Object.keys(letterSchemas).length
        );

        const rootIndex =
            root.octave * 12 +
            letterSchemas[root.letter].index +
            accidentalSchemas[root.accidental].shift;

        const accidentalShift: number =
            rootIndex +
            totalSemitonesByInterval(interval) -
            (newNoteOctave * 12 + letterSchemas[newNoteLetter].index);

        const newNoteAccidental = (
            Object.keys(accidentalSchemas) as Accidental[]
        ).find((key) => accidentalSchemas[key].shift == accidentalShift);

        result.push(new Note(newNoteLetter, newNoteAccidental, newNoteOctave));
    });

    return result;
}
