import { Button, Form } from 'react-bootstrap';
import { pianoSynth } from '../audio/pianoSynth';
import { Chord } from '../theory-utils/chord';
import * as Tone from 'tone';
import { startTone } from '../audio/startTone';
import Table from 'react-bootstrap/Table';
import _, { parseInt } from 'lodash';
import { ReactElement, useEffect, useState } from 'react';
import { allScales } from '../theory-utils/getScalesByNotes';
import { BsPauseFill, BsPlay, BsPlayFill, BsStopFill } from 'react-icons/bs';

interface Step {
    chord: Chord;
    length: number;
}

const defaultOctave = 4;

const numberOfStepsOptions = [4, 8, 16, 32, 64, 128];

export function ChordSequencer() {
    const [selectedScale, setSelectedScale] = useState<number>(0);
    const [stepsCount, setStepsCount] = useState<number>(32);

    const scale = allScales[selectedScale];

    const [steps, setSteps] = useState<(Step | null)[]>(
        _.fill(_.range(0, stepsCount), null),
    );

    const [activeStepIndex, setActiveStepIndex] = useState(0);

    function handleStepDurationChange(targetStepIndex: number, input: number) {
        const newSteps: (Step | null)[] = [];
        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            if (i === targetStepIndex && step != null) {
                newSteps.push({
                    ...step,
                    length: i + input <= steps.length ? input : 1,
                });
            } else {
                const changedStep = newSteps[targetStepIndex];
                if (
                    i > targetStepIndex &&
                    changedStep != null &&
                    i < targetStepIndex + changedStep.length
                ) {
                    // remove overlap
                    newSteps.push(null);
                } else {
                    newSteps.push(steps[i]);
                }
            }
        }
        setSteps(newSteps);
    }

    function handleStepsCountChange(newStepsCount: number) {
        setStepsCount(newStepsCount);
        let newSteps = steps.slice(0, newStepsCount);
        if (newStepsCount > steps.length) {
            newSteps = [
                ...newSteps,
                ...new Array(newStepsCount - steps.length).fill(null),
            ];
        }
        setSteps(newSteps);
    }

    function getColumns() {
        const columns: ReactElement[] = [];
        let iCurrStep = 0;
        for (const [iStep, step] of steps.entries()) {
            if (iCurrStep + (steps[iCurrStep]?.length ?? 1) == iStep) {
                iCurrStep = iStep;
            }
            columns.push(
                <td
                    key={iStep}
                    className={
                        iStep === activeStepIndex ? 'bg-secondary-subtle' : ''
                    }
                    style={{
                        borderLeftStyle:
                            iStep !== iCurrStep ? 'hidden' : undefined,
                    }}
                >
                    <div className={iStep !== iCurrStep ? 'invisible' : ''}>
                        <div className="mb-3 h2">
                            {step?.chord.format('short') ?? <>&nbsp;</>}
                        </div>
                        <Form.Group className="mb-3">
                            <Form.Label>Chord</Form.Label>
                            <Form.Select
                                size="sm"
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    setSteps(
                                        steps.map((step, i) =>
                                            i === iStep
                                                ? val == -1
                                                    ? null
                                                    : {
                                                          chord: scale.chords[
                                                              val
                                                          ][0].setOctave(
                                                              defaultOctave,
                                                          ),
                                                          length:
                                                              step?.length ?? 1,
                                                      }
                                                : step,
                                        ),
                                    );
                                }}
                                value={
                                    step == null
                                        ? '-1'
                                        : scale.chords.findIndex((x) =>
                                              x[0].equals(step!.chord),
                                          )
                                }
                            >
                                <option value="-1">-</option>
                                {scale.chords.map((chord, i) => (
                                    <option value={i}>
                                        {chord[0].format('short')}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Octave</Form.Label>
                            <Form.Select
                                size="sm"
                                disabled={step == null}
                                onChange={(e) => {
                                    setSteps(
                                        steps.map((step, i) =>
                                            i === iStep && step != null
                                                ? {
                                                      chord: step.chord.setOctave(
                                                          parseInt(
                                                              e.target.value,
                                                          ),
                                                      ),
                                                      length: step?.length ?? 1,
                                                  }
                                                : step,
                                        ),
                                    );
                                }}
                                value={
                                    step?.chord.tonic.octave ?? defaultOctave
                                }
                            >
                                {[2, 3, 4, 5].map((i) => (
                                    <option value={i}>{i}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Duration</Form.Label>
                            <Form.Select
                                size="sm"
                                disabled={step == null}
                                onChange={(e) =>
                                    handleStepDurationChange(
                                        iStep,
                                        parseInt(e.target.value),
                                    )
                                }
                                value={step?.length ?? 1}
                            >
                                {_.range(1, steps.length + 1).map((i) => (
                                    <option value={i}>{i}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </div>
                </td>,
            );
        }

        return columns;
    }

    useEffect(() => {
        Tone.Transport.cancel();
        pianoSynth.releaseAll();
        for (let i = 0; i <= steps.length; i++) {
            Tone.Transport.schedule(
                () => {
                    if (i === steps.length) {
                        Tone.Transport.stop();
                        setActiveStepIndex(0);
                    } else {
                        const step = steps[i];
                        if (step) {
                            const notes = step.chord.notes.map((x) =>
                                x.format(true),
                            );
                            pianoSynth.triggerAttack(notes);
                            Tone.Transport.schedule(
                                () => pianoSynth.triggerRelease(notes),
                                { '8n': (i + step.length) * 0.99 },
                            );
                        }
                        setActiveStepIndex(i);
                    }
                },
                { '8n': i },
            );
        }
    }, [steps]);

    async function play() {
        await startTone();
        if (Tone.Transport.state === 'started') {
            Tone.Transport.stop();
            pianoSynth.releaseAll();
            setActiveStepIndex(0);
        } else {
            Tone.Transport.start();
        }
    }

    return (
        <div>
            <h3>Chord Sequencer</h3>

            <Form.Group className="mb-3">
                <Form.Label>Scale</Form.Label>
                <Form.Select
                    size="sm"
                    onChange={(e) => {
                        setSelectedScale(parseInt(e.target.value));
                    }}
                    value={selectedScale}
                >
                    {allScales.map((scale, index) => (
                        <option value={index}>{scale.format('long')}</option>
                    ))}
                </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Steps (1/8)</Form.Label>
                <Form.Select
                    size="sm"
                    onChange={(e) =>
                        handleStepsCountChange(parseInt(e.target.value))
                    }
                    value={stepsCount}
                >
                    {numberOfStepsOptions.map((option) => (
                        <option value={option}>{option}</option>
                    ))}
                </Form.Select>
            </Form.Group>

            <p>Sequencer</p>
            <Table bordered responsive>
                <tbody>
                    <tr>
                        <td className="text-nowrap text-muted">1 / 4</td>
                        {_.range(0, steps.length / 2).map((index) => (
                            <td
                                className={`text-nowrap text-center text-muted`}
                                key={index}
                                colSpan={2}
                            >
                                {index + 1}
                            </td>
                        ))}
                    </tr>
                    <tr>
                        <td className="text-nowrap text-muted">1 / 8</td>
                        {steps.map((_step, i) => (
                            <td
                                className={`text-nowrap text-center text-muted ${
                                    i === activeStepIndex
                                        ? 'bg-secondary-subtle'
                                        : ''
                                }`}
                                key={i}
                                style={{ minWidth: '50px' }}
                            >
                                {i + 1}
                            </td>
                        ))}
                    </tr>
                    <tr>
                        <td></td>
                        {getColumns()}
                    </tr>
                </tbody>
            </Table>
            <div className="mt-3">
                <Button variant="dark" onClick={play}>
                    {Tone.Transport.state !== 'started' ? (
                        <>
                            <BsPlayFill /> Play
                        </>
                    ) : (
                        <>
                            <BsStopFill /> Stop
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
