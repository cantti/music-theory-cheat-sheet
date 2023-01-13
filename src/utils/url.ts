import { Note } from '../theory-utils/note/Note';
import { MajorScale } from '../theory-utils/scales/MajorScale';
import { NaturalMinorScale } from '../theory-utils/scales/NaturalMinorScale';
import { Scale } from '../theory-utils/scales/Scale';

export function getScaleUrl(key: Scale) {
    const scale = `${key.tonic.letter}${key.tonic.symbol}${key.shortName}`;
    return `/circle/${encodeURIComponent(scale)}`;
}

export function getScaleFormUrlParams(scale: string) {
    const pattern = /^(?<tonic>[cdefgab][#b]?)(?<minor>m?)$/i;
    const match = scale.match(pattern);
    const tonic = Note.fromString(`${match?.groups?.tonic}`);
    const activeScaleFromUrl = match?.groups?.minor
        ? new NaturalMinorScale(tonic)
        : new MajorScale(tonic);
    return activeScaleFromUrl;
}
