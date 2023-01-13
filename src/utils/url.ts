import { Note } from '../theory-utils/notes';
import { MajorScale } from '../theory-utils/scales/MajorScale';
import { NaturalMinorScale } from '../theory-utils/scales/NaturalMinorScale';
import { Scale } from '../theory-utils/scales/Scale';

export function getScaleUrl(scale: Scale) {
    return `/circle/${encodeURIComponent(scale.format('short'))}`;
}

export function getScaleFormUrlParams(scale: string) {
    const pattern = /^(?<tonic>[cdefgab][#b]?)(?<minor>m?)$/i;
    const match = scale.match(pattern);
    const tonic = Note.create(`${match?.groups?.tonic}`);
    const activeScaleFromUrl = match?.groups?.minor
        ? new NaturalMinorScale(tonic)
        : new MajorScale(tonic);
    return activeScaleFromUrl;
}
