import * as Tone from "tone";

const started = false;

export async function startTone() {
  if (!started) {
    await Tone.start();
  }
}
