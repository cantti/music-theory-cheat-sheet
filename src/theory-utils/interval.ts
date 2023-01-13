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
