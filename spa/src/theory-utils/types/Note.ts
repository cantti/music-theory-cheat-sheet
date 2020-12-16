import { Letter } from "./Letter";
import { Symbol } from "./Symbol";

export interface Note {
    letter: Letter;
    symbol: Symbol;
    octave: number;
}
