import { Note } from "./types/Note";

export const formatNote = (note: Note) => {
    let result: string = note.letter;
    switch (note.symbol) {
        case "Sharp":
            result += "#";
            break;
        case "DoubleSharp":
            result += "##";
            break;
        case "Flat":
            result += "b";
            break;
        case "DoubleFlat":
            result += "bb";
            break;
        default:
            break;
    }
    return result;
};
