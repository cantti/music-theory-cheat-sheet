export type ScaleName =
    | 'Natural Minor'
    | 'Major'
    | 'Harmonic Minor'
    | 'Melodic Minor'
    | 'Major Pentatonic'
    | 'Minor Pentatonic';

export function isScaleName(value: string): value is ScaleName {
    return [
        'Natural Minor',
        'Major',
        'Harmonic Minor',
        'Melodic Minor',
        'Major Pentatonic',
        'Minor Pentatonic',
    ].includes(value);
}
