import { ScaleName } from "../scales";
import { Note } from "./Note";

export type ConcreteScale = {
    tonic: Note;
    scaleName: ScaleName;
};
