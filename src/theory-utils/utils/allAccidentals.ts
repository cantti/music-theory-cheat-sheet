import { DoubleFlat, DoubleSharp, Flat, Natural, Sharp } from "../accidental";

const natural = new Natural();
const sharp = new Sharp();
const doubleSharp = new DoubleSharp();
const flat = new Flat();
const doubleFlat = new DoubleFlat();

export const allAccidentals = [sharp, doubleSharp, flat, doubleFlat, natural];
