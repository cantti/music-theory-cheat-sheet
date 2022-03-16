import { Note } from '../theory-utils/note/Note';
import { MajorScale } from '../theory-utils/scales/MajorScale';
import { NaturalMinorScale } from '../theory-utils/scales/NaturalMinorScale';
import { Scale } from '../theory-utils/scales/Scale';
import { isLetter } from '../theory-utils/utils/isLetter';
import { isSymbol } from '../theory-utils/utils/isSymbol';

export function getScaleUrl(key: Scale) {
    return (
        '/keys/' +
        key.tonic.letter +
        (key.tonic.symbol !== '' ? key.tonic.symbol : '') +
        '/' +
        key.getShortName()
    );
}

export function getScaleFormUrlParams(
    tonic?: string,
    scale?: string
): Scale | null {
    if (!tonic) {
        return null;
    }

    const tonicLetter = tonic[0];

    if (!isLetter(tonicLetter)) {
        return null;
    }

    const tonicSymbol = tonic.length > 1 ? tonic.substring(1) : '';

    if (!isSymbol(tonicSymbol)) {
        return null;
    }

    const tonicNote = new Note(tonicLetter, tonicSymbol);

    const activeScaleFromUrl =
        scale === 'm'
            ? new NaturalMinorScale(tonicNote)
            : new MajorScale(tonicNote);

    return activeScaleFromUrl;
}
