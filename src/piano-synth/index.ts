import * as Tone from 'tone';

function createPianoSynth() {
    return new Tone.Sampler({
        urls: {
            C3: 'Piano5_0x7F_C-3.wav',
            C4: 'Piano5_0x7F_C-4.wav',
            // 'F#4': 'Piano5_0x7F_F#4.wav',
            C5: 'Piano5_0x7F_C-5.wav',
            // 'F#5': 'Piano5_0x7F_F#5.wav',
            C6: 'Piano5_0x7F_C-6.wav',
        },
        baseUrl: process.env.PUBLIC_URL + '/piano-samples/',
        release: 1,
    }).toDestination();
}

export { createPianoSynth };
