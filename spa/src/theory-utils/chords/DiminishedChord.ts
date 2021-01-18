import { Interval } from '../interval/Interval';
import { Chord } from './Chord';

export class DiminishedChord extends Chord {
    _name: string = 'Diminished';
    _shortName: string = 'dim';
    _intervals: Interval[] = [
        { name: 'Unison', quality: 'Perfect' },
        { name: 'Third', quality: 'Minor' },
        { name: 'Fifth', quality: 'Diminished' },
    ];
}
