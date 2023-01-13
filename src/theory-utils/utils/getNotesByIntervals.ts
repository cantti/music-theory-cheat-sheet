import { Interval, IntervalNumber } from '../interval';
import { allLetters, Letter } from '../letters';
import { Note } from '../notes';
import { allSymbols } from '../symbols';

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
        const newNoteLetter: Letter =
            allLetters[
                (allLetters.findIndex((x) => x.equals(root.letter)) +
                    sortedIntervals.indexOf(interval.name)) %
                    allLetters.length
            ];

        const newNoteOctave: number = Math.trunc(
            root.octave +
                (allLetters.findIndex((x) => x.equals(root.letter)) +
                    sortedIntervals.indexOf(interval.name)) /
                    allLetters.length
        );

        const rootIndex =
            root.octave * 12 + root.letter.index + root.symbol.shift;

        const symbolShift: number =
            rootIndex +
            totalSemitonesByInterval(interval) -
            (newNoteOctave * 12 + newNoteLetter.index);

        const newNoteSymbol = allSymbols.find((x) => x.shift === symbolShift);

        result.push(new Note(newNoteLetter, newNoteSymbol, newNoteOctave));
    });

    return result;
}
