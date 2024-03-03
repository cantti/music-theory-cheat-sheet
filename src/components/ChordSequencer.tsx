import { Button, ButtonGroup, Form } from 'react-bootstrap';
import { pianoSynth } from '../audio/pianoSynth';
import { Chord } from '../theory-utils/chord';
import * as Tone from 'tone';
import { startTone } from '../audio/startTone';
import Table from 'react-bootstrap/Table';
import _, { parseInt } from 'lodash';
import { ReactElement, useEffect, useState } from 'react';
import { allScales } from '../theory-utils/getScalesByNotes';

interface Step {
    chord: Chord;
    length: number;
}

const defaultOctave = 4;

export function ChordSequencer() {
    const [selectedScale, setSelectedScale] = useState<number>(0);

    const scale = allScales[selectedScale];

    const [steps, setSteps] = useState<(Step | null)[]>(
        _.fill(_.range(0, 32), null),
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
                    className={iStep !== iCurrStep ? 'invisible' : ''}
                    style={{
                        borderLeftStyle:
                            iStep !== iCurrStep ? 'hidden' : undefined,
                    }}
                >
                    <div className="mb-3 h2">
                        {step?.chord.format('short') ?? <>&nbsp;</>}
                    </div>

                    <Form.Group className="mb-3">
                        <Form.Label>Chord</Form.Label>
                        <Form.Select
                            size="sm"
                            onChange={(e) => {
                                const val = parseInt(e.currentTarget.value);
                                setSteps(
                                    steps.map((step, i2) =>
                                        i2 === iStep
                                            ? val == -1
                                                ? null
                                                : {
                                                      chord: scale.chords[
                                                          val
                                                      ][0].setOctave(
                                                          defaultOctave,
                                                      ),
                                                      length: step?.length ?? 1,
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
                            {scale.chords.map((chord, i2) => (
                                <option value={i2}>
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
                                    steps.map((step, i2) =>
                                        i2 === iStep && step != null
                                            ? {
                                                  chord: step.chord.setOctave(
                                                      parseInt(
                                                          e.currentTarget.value,
                                                      ),
                                                  ),
                                                  length: step?.length ?? 1,
                                              }
                                            : step,
                                    ),
                                );
                            }}
                            value={step?.chord.tonic.octave ?? defaultOctave}
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
                                    parseInt(e.currentTarget.value),
                                )
                            }
                            value={step?.length ?? 1}
                        >
                            {_.range(1, steps.length + 1).map((i) => (
                                <option value={i}>{i}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </td>,
            );
        }

        return columns;
    }

    useEffect(() => {
        Tone.Transport.cancel();
        for (let i = 0; i <= steps.length; i++) {
            Tone.Transport.schedule(
                () => {
                    if (i === steps.length) {
                        Tone.Transport.position = 0;
                    } else {
                        const step = steps[i];
                        if (step) {
                            pianoSynth.triggerAttackRelease(
                                step.chord.notes.map((x) => x.format(true)),
                                { '8n': step.length },
                                Tone.now(),
                                0.5,
                            );
                        }
                        setActiveStepIndex(i);
                    }
                },
                { '8n': i },
            );
        }
    }, [activeStepIndex, steps]);

    async function play() {
        await startTone();
        if (Tone.Transport.state === 'started') {
            Tone.Transport.stop();
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
                                        ? 'bg-danger-subtle'
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
                <Button variant="primary" onClick={play}>
                    Play
                </Button>
            </div>
        </div>
    );
}
