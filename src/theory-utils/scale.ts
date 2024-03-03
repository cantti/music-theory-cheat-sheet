import { Chord, ChordName } from "./chord";
import { Note } from "./note";
import { getNotesByIntervals } from "./getNotesByIntervals";
import { Interval, interval } from "./interval";

export type ScaleName =
  | "Natural Minor"
  | "Major"
  | "Harmonic Minor"
  | "Melodic Minor"
  | "Major Pentatonic"
  | "Minor Pentatonic";

export function isScaleName(value: string): value is ScaleName {
  return [
    "Natural Minor",
    "Major",
    "Harmonic Minor",
    "Melodic Minor",
    "Major Pentatonic",
    "Minor Pentatonic",
  ].includes(value);
}

export class Scale {
  constructor(
    public tonic: Note,
    public readonly name: ScaleName,
  ) {}

  get shortName() {
    return scaleSchemas[this.name].shortName;
  }

  get notes() {
    return getNotesByIntervals(this.tonic, this.intervals);
  }

  get notesWithTopTonic() {
    return getNotesByIntervals(this.tonic, [
      ...this.intervals,
      interval("Octave", "Perfect"),
    ]);
  }

  get intervals() {
    return scaleSchemas[this.name].intervals;
  }

  get chords() {
    return scaleSchemas[this.name].chords.map((chords, index) =>
      chords.map((chord) => new Chord(this.notes[index], chord)),
    );
  }

  format(kind: "short" | "long" = "long", showOctave: boolean = false) {
    if (kind === "short") {
      return this.tonic.format(showOctave) + this.shortName;
    } else {
      return this.tonic.format(showOctave) + " " + this.name;
    }
  }
}

export function scale(tonic: Note, name: ScaleName) {
  return new Scale(tonic, name);
}

type ScaleSchema = {
  shortName: string;
  intervals: Interval[];
  chords: ChordName[][];
};

type ScaleSchemas = {
  [K in ScaleName]: ScaleSchema;
};

export const scaleSchemas: ScaleSchemas = {
  Major: {
    shortName: "",
    intervals: [
      interval("Second", "Major"),
      interval("Third", "Major"),
      interval("Fourth", "Perfect"),
      interval("Fifth", "Perfect"),
      interval("Sixth", "Major"),
      interval("Seventh", "Major"),
    ],
    chords: [
      ["Major"],
      ["Minor"],
      ["Minor"],
      ["Major"],
      ["Major"],
      ["Minor"],
      ["Diminished"],
    ],
  },
  "Natural Minor": {
    shortName: "m",
    intervals: [
      interval("Second", "Major"),
      interval("Third", "Minor"),
      interval("Fourth", "Perfect"),
      interval("Fifth", "Perfect"),
      interval("Sixth", "Minor"),
      interval("Seventh", "Minor"),
    ],
    chords: [
      ["Minor"],
      ["Diminished"],
      ["Major"],
      ["Minor"],
      ["Minor"],
      ["Major"],
      ["Major"],
    ],
  },
  "Harmonic Minor": {
    shortName: "",
    intervals: [
      interval("Second", "Major"),
      interval("Third", "Minor"),
      interval("Fourth", "Perfect"),
      interval("Fifth", "Perfect"),
      interval("Sixth", "Minor"),
      interval("Seventh", "Major"),
    ],
    chords: [
      ["Minor"],
      ["Diminished"],
      ["Augmented"],
      ["Minor"],
      ["Major"],
      ["Major"],
      ["Diminished"],
    ],
  },
  "Melodic Minor": {
    shortName: "",
    intervals: [
      interval("Second", "Major"),
      interval("Third", "Minor"),
      interval("Fourth", "Perfect"),
      interval("Fifth", "Perfect"),
      interval("Sixth", "Major"),
      interval("Seventh", "Major"),
    ],
    chords: [
      ["Minor"],
      ["Minor"],
      ["Augmented"],
      ["Major"],
      ["Major"],
      ["Diminished"],
      ["Diminished"],
    ],
  },
  "Major Pentatonic": {
    shortName: "",
    intervals: [
      interval("Second", "Major"),
      interval("Third", "Major"),
      interval("Fifth", "Perfect"),
      interval("Sixth", "Major"),
    ],
    chords: [],
  },
  "Minor Pentatonic": {
    shortName: "",
    intervals: [
      interval("Third", "Minor"),
      interval("Fourth", "Perfect"),
      interval("Fifth", "Perfect"),
      interval("Seventh", "Minor"),
    ],
    chords: [],
  },
};
