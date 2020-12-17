import { ChordName } from "../chords";
import { Note } from "./Note";

export type ConcreteChord = {
    root: Note;
    chord: ChordName;
};
