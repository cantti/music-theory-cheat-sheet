import { letterIndices } from "./letterIndices";
import { Note } from "./types/Note";
import { symbolShifts } from "./symbolShifts";

const getNoteIndex = (note: Note) =>
    note.octave * 12 +
    letterIndices.find((x) => x.letter === note.letter)!.index +
    symbolShifts.find((x) => x.symbol === note.symbol)!.shift;

export { getNoteIndex };
