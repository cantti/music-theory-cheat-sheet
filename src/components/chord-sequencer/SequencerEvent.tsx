import { Chord } from '../../theory-utils/chord';

export interface SequencerEvent {
  chord: Chord;
  start: number;
  end: number;
}
