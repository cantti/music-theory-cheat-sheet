import { Interval } from "./types/Interval";
import { IntervalNumber } from "./types/IntervalNumber";
import { Letter } from "./types/Letter";
import { letterIndices } from "./letterIndices";
import { Note } from "./types/Note";
import { Symbol } from "./types/Symbol";
import { symbolShifts } from "./symbolShifts";

const majorScaleSemitones: {
    interval: Interval;
    semitones: number;
}[] = [
    {
        interval: { name: "Unison", quality: "Perfect" },
        semitones: 0,
    },
    {
        interval: { name: "Second", quality: "Major" },
        semitones: 2,
    },
    {
        interval: { name: "Third", quality: "Major" },
        semitones: 4,
    },
    {
        interval: { name: "Fourth", quality: "Perfect" },
        semitones: 5,
    },
    {
        interval: { name: "Fifth", quality: "Perfect" },
        semitones: 7,
    },
    {
        interval: { name: "Sixth", quality: "Major" },
        semitones: 9,
    },
    {
        interval: { name: "Seventh", quality: "Major" },
        semitones: 11,
    },
    {
        interval: { name: "Octave", quality: "Perfect" },
        semitones: 12,
    },
];

function totalSemitonesByInterval(interval: Interval): number {
    const errorMessage: string = "Invalid interval";
    const majorScaleInterval = majorScaleSemitones.filter(
        (x) => x.interval.name === interval.name
    )[0];
    if (interval.quality === "Major" || interval.quality === "Perfect") {
        return majorScaleInterval.semitones;
    }
    if (majorScaleInterval.interval.quality === "Perfect") {
        switch (interval.quality) {
            case "Diminished":
                return majorScaleInterval.semitones - 1;
            case "Augmented":
                return majorScaleInterval.semitones + 1;
            default:
                throw new Error(errorMessage);
        }
    }
    //Major
    else {
        switch (interval.quality) {
            case "Minor":
                return majorScaleInterval.semitones - 1;
            case "Diminished":
                return majorScaleInterval.semitones - 2;
            case "Augmented":
                return majorScaleInterval.semitones + 1;
            default:
                throw new Error(errorMessage);
        }
    }
}

export function notesByIntervals(
    root: Note,
    intervals: Array<Interval>
): Note[] {
    const sortedIntervals: IntervalNumber[] = [
        "Unison",
        "Second",
        "Third",
        "Fourth",
        "Fifth",
        "Sixth",
        "Seventh",
        "Octave",
    ];

    let result: Note[] = [];

    intervals.forEach((interval) => {
        const newNoteLetter: Letter =
            letterIndices[
                (letterIndices.findIndex((x) => x.letter === root.letter) +
                    sortedIntervals.indexOf(interval.name)) %
                    letterIndices.length
            ].letter;

        const newNoteOctave: number = Math.trunc(
            root.octave +
                (letterIndices.findIndex((x) => x.letter === root.letter) +
                    sortedIntervals.indexOf(interval.name)) /
                    letterIndices.length
        );

        const rootIndex =
            root.octave * 12 +
            letterIndices.find((x) => x.letter === root.letter)!.index +
            symbolShifts.find((x) => x.symbol === root.symbol)!.shift;

        const symbolShift: number =
            rootIndex +
            totalSemitonesByInterval(interval) -
            (newNoteOctave * 12 +
                letterIndices.find((x) => x.letter === newNoteLetter)!.index);

        const newNoteSymbol: Symbol = symbolShifts.find(
            (x) => x.shift === symbolShift
        )!.symbol;

        let newNote: Note = {
            letter: newNoteLetter,
            octave: newNoteOctave,
            symbol: newNoteSymbol,
        };

        result.push(newNote);
    });

    return result;
}
