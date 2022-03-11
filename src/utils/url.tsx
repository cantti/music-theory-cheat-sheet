import { Note } from '../theory-utils/note/Note';
import { MajorScale } from '../theory-utils/scales/MajorScale';
import { NaturalMinorScale } from '../theory-utils/scales/NaturalMinorScale';
import { Scale } from '../theory-utils/scales/Scale';
import { isLetter } from '../theory-utils/utils/isLetter';
import { isSymbol } from '../theory-utils/utils/isSymbol';

export function getScaleUrl(key: Scale): string {
    return (
        '/scales/' +
        key.tonic.letter +
        (key.tonic.symbol !== 'None' ? '-' + key.tonic.symbol : '') +
        '/' +
        key.getShortName()
    );
}

export function getScaleFormUrlParams(params: {
    tonic?: string;
    scale?: string;
}): Scale | null {
    if (!params.tonic) {
        return null;
    }

    const tonicLetter = params.tonic[0];

    if (!isLetter(tonicLetter)) {
        return null;
    }

    const tonicSymbol =
        params.tonic.length > 1 ? params.tonic.substring(2) : 'None';

    if (!isSymbol(tonicSymbol)) {
        return null;
    }

    const tonicNote = new Note(tonicLetter, tonicSymbol);

    const activeScaleFromUrl =
        params.scale === 'm'
            ? new NaturalMinorScale(tonicNote)
            : new MajorScale(tonicNote);

    return activeScaleFromUrl;
}
