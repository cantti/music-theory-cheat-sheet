import { createMajor } from "./major";
import { createMinor } from "./minor";
import { createDiminished } from "./diminished";
import { ScaleName } from "../scales";

export type ChordName = "major" | "minor" | "diminished";

export const getChord = (chordName: ChordName) => {
    switch (chordName) {
        case "major":
            return createMajor();
        case "minor":
            return createMinor();
        case "diminished":
            return createDiminished();
        default:
            throw Error("Invalid chord name");
    }
};

export const getChordsByScale = (scaleName: ScaleName) => {
    switch (scaleName) {
        case "naturalMinor":
            return [
                [getChord("minor")],
                [getChord("diminished")],
                [getChord("major")],
                [getChord("minor")],
                [getChord("minor")],
                [getChord("major")],
                [getChord("major")],
            ];
        case "major":
            return [
                [getChord("major")],
                [getChord("minor")],
                [getChord("minor")],
                [getChord("major")],
                [getChord("major")],
                [getChord("minor")],
                [getChord("diminished")],
            ];
        default:
            throw Error("Invalid scale name");
    }
};

export { createMajor, createMinor, createDiminished };
