import { letters } from "./Letter";
import { Note } from "./Note";
import { symbols } from "./Symbol";

const getNoteIndex = (note: Note) =>
    note.octave * 12 +
    letters.find((x) => x.letter === note.letter)!.index +
    symbols.find((x) => x.symbol === note.symbol)!.shift;

export { getNoteIndex };
