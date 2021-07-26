import { Scale } from '../theory-utils/scales/Scale';

export function getKeysUrl(key: Scale): string {
    return '/keys/' +
        key.tonic.letter +
        (key.tonic.symbol !== 'None'
            ? '-' + key.tonic.symbol
            : '') +
        '/' +
        key.getShortName();
}
