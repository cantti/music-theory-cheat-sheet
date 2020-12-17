import { Chord } from "../types/Chord";

export const createDiminished = (): Chord => ({
    name: "Diminished",
    shortName: "dim",
    intervals: [
        { name: "Unison", quality: "Perfect" },
        { name: "Third", quality: "Minor" },
        { name: "Fifth", quality: "Diminished" },
    ],
});
