import * as Tone from 'tone';

const pianoSynth = new Tone.Sampler({
    urls: {
        C3: 'Piano5_0x7F_C-3.wav',
        C4: 'Piano5_0x7F_C-4.wav',
        C5: 'Piano5_0x7F_C-5.wav',
        C6: 'Piano5_0x7F_C-6.wav',
    },
    baseUrl: import.meta.env.BASE_URL + 'piano-samples/',
    release: 1,
});

pianoSynth.toDestination();

export { pianoSynth };
