export type IntervalNumber =
    | 'Unison'
    | 'Second'
    | 'Third'
    | 'Fourth'
    | 'Fifth'
    | 'Sixth'
    | 'Seventh'
    | 'Octave';

export type IntervalQuality =
    | 'Perfect'
    | 'Minor'
    | 'Major'
    | 'Diminished'
    | 'Augmented';

export class Interval {
    constructor(public name: IntervalNumber, public quality: IntervalQuality) {}
}

export function interval(name: IntervalNumber, quality: IntervalQuality) {
    return new Interval(name, quality);
}
