import { Chord } from "../types/Chord";

export const createMinor = (): Chord => ({
    name: "Minor",
    shortName: "m",
    intervals: [
        { name: "Unison", quality: "Perfect" },
        { name: "Third", quality: "Minor" },
        { name: "Fifth", quality: "Perfect" },
    ],
});
