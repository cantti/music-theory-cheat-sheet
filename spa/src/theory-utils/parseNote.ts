import { Note } from './types/Note';

export const parseNote = (parse: string) => {
    let note: Note = {
        letter: 'C',
        symbol: 'None',
        octave: 0,
    };
    switch (parse[0].toUpperCase()) {
        case 'C':
            note.letter = 'C';
            break;
        case 'D':
            note.letter = 'D';
            break;
        case 'E':
            note.letter = 'E';
            break;
        case 'F':
            note.letter = 'F';
            break;
        case 'G':
            note.letter = 'G';
            break;
        case 'A':
            note.letter = 'A';
            break;
        case 'B':
            note.letter = 'B';
            break;
        default:
            throw new Error();
    }
    if (parse.length > 1) {
        switch (parse[1]) {
            case '#':
                note.symbol = 'Sharp';
                break;
            case '##':
                note.symbol = 'DoubleSharp';
                break;
            case 'b':
                note.symbol = 'Flat';
                break;
            case 'bb':
                note.symbol = 'DoubleFlat';
                break;
            default:
                break;
        }
    }
    return note;
};
