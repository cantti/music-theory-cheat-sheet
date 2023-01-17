import { AccidentalSign } from '../theory-utils/accidental/AccidentalSign';
import { LetterChar } from '../theory-utils/letter/LetterChar';
import { Note } from '../theory-utils/note';
import { Scale, ScaleName } from '../theory-utils/scale';

export function getScaleFormUrlParams(scale: string) {
    const pattern = /^(?<tonic>[cdefgab])(?<accidental>[#b]?)[ ]?(?<name>.*)$/i;
    const match = scale.match(pattern);
    return new Scale(
        new Note(
            match!.groups!.tonic.toLocaleUpperCase() as LetterChar,
            match!.groups!.accidental as AccidentalSign
        ),
        match?.groups?.name ? (match?.groups?.name as ScaleName) : 'Major'
    );
}
