import { isAccidental } from "../theory-utils/accidental";
import { isLetterChar } from "../theory-utils/letter";
import { Note } from "../theory-utils/note";
import { Scale, isScaleName } from "../theory-utils/scale";

export class ScaleParamError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "ScaleParamError";
  }
}

export const defaultScaleParam = encodeURIComponent(
  new Scale(new Note("C"), "Major").format(),
);

export function getScaleFormUrlParams(scale: string) {
  const pattern = /^(?<tonic>[CDEFGAB])(?<accidental>[#b]?)[ ]?(?<name>.+)$/;
  const match = scale.match(pattern);
  if (
    match &&
    match.groups &&
    isLetterChar(match.groups.tonic) &&
    isAccidental(match.groups.accidental) &&
    isScaleName(match.groups.name)
  ) {
    return new Scale(
      new Note(match.groups.tonic, match.groups.accidental),
      match.groups.name,
    );
  } else {
    throw new ScaleParamError();
  }
}
