import { debug } from "console";
import { Interval } from "./Interval";
import { IntervalNumber, diatonicNumbers } from "./IntervalNumber";
import { Letter, letters } from "./Letter";
import { Note } from "./Note";
import { Symbol, symbols } from "./Symbol";

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

export function notesByInterval(
    root: Note,
    intervals: Array<Interval>
): Note[] {
    let result: Note[] = [];

    intervals.forEach((interval) => {
        const newNoteLetter: Letter =
            letters[
                (letters.findIndex((x) => x.letter === root.letter) +
                    diatonicNumbers.indexOf(interval.name)) %
                    letters.length
            ].letter;

        const newNoteOctave: number = Math.trunc(
            root.octave +
                (letters.findIndex((x) => x.letter === root.letter) +
                    diatonicNumbers.indexOf(interval.name)) /
                    letters.length
        );

        const rootIndex =
            root.octave * 12 +
            letters.find((x) => x.letter === root.letter)!.index +
            symbols.find((x) => x.symbol === root.symbol)!.shift;

        const symbolShift: number =
            rootIndex +
            totalSemitonesByInterval(interval) -
            (newNoteOctave * 12 +
                letters.find((x) => x.letter === newNoteLetter)!.index);

        const newNoteSymbol: Symbol = symbols.find(
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
