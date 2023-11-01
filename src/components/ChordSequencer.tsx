import { Button, ButtonGroup, Form } from 'react-bootstrap';
import { pianoSynth } from '../audio/pianoSynth';
import { Chord, chord } from '../theory-utils/chord';
import { n } from '../theory-utils/note';
import * as Tone from 'tone';
import { startTone } from '../audio/startTone';
import Table from 'react-bootstrap/Table';
import _ from 'lodash';
import { ReactElement, useEffect, useState } from 'react';
import { allScales } from '../theory-utils/getScalesByNotes';

interface Step {
    chord: Chord;
    length: number;
}

export function ChordSequencer() {
    const [selectedScale, setSelectedScale] = useState<number>(0);

    const scale = allScales[selectedScale];

    const [steps, setSteps] = useState<(Step | null)[]>([
        { chord: chord(n('C'), 'Major'), length: 8 },
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        { chord: chord(n('F'), 'Major'), length: 8 },
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        { chord: chord(n('G'), 'Major'), length: 8 },
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        { chord: chord(n('A'), 'Minor'), length: 4 },
        null,
        null,
        null,
        { chord: chord(n('B'), 'Diminished'), length: 4 },
        null,
        null,
        null,
    ]);

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
        let currentStep: Step | null = null;
        for (let i = 0; i < steps.length; i++) {
            if (
                currentStep &&
                i < steps.indexOf(currentStep) + currentStep.length
            ) {
                continue;
            }
            currentStep = steps[i];
            columns.push(
                <td key={i} colSpan={currentStep?.length ?? 1}>
                    <div className="mb-3 h2">
                        {currentStep?.chord.format('short') ?? <>&nbsp;</>}
                    </div>

                    <div className="mb-3">
                        <div className="mb-1">Select chord</div>
                        <ButtonGroup size="sm">
                            <Button
                                variant="outline-secondary"
                                onClick={() => {
                                    setSteps(
                                        steps.map((step, stepIndex) =>
                                            stepIndex === i ? null : step
                                        )
                                    );
                                }}
                            >
                                Rest
                            </Button>
                            {scale.chords.map((chord, index) => (
                                <Button
                                    key={index}
                                    variant="outline-secondary"
                                    onClick={() => {
                                        setSteps(
                                            steps.map((step, stepIndex) =>
                                                stepIndex === i
                                                    ? {
                                                          chord: chord[0],
                                                          length:
                                                              step?.length ?? 1,
                                                      }
                                                    : step
                                            )
                                        );
                                    }}
                                >
                                    {chord[0].format('short')}
                                </Button>
                            ))}
                        </ButtonGroup>
                    </div>

                    <Form.Group className="mb-3">
                        <Form.Label>Duration</Form.Label>
                        <Form.Select
                            size="sm"
                            disabled={currentStep == null}
                            onChange={(e) =>
                                handleStepDurationChange(
                                    i,
                                    parseInt(e.currentTarget.value)
                                )
                            }
                            value={currentStep?.length ?? 1}
                        >
                            {_.range(1, steps.length + 1).map((i) => (
                                <option value={i}>{i}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </td>
            );
        }

        return columns;
    }

    useEffect(() => {
        Tone.Transport.cancel();
        for (let i = 0; i < steps.length; i++) {
            Tone.Transport.schedule(
                () => {
                    const step = steps[i];
                    if (step) {
                        pianoSynth.triggerAttackRelease(
                            step.chord.notes.map((x) => x.format(true)),
                            { '8n': step.length },
                            Tone.now(),
                            0.5
                        );
                    }
                    setActiveStepIndex(i);
                    if (i === steps.length - 1) {
                        Tone.Transport.position = 0;
                    }
                },
                { '8n': i }
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
                        {_.range(0, steps.length / 2).map((i) => (
                            <td
                                className={`text-nowrap text-center text-muted`}
                                key={i}
                                colSpan={2}
                            >
                                {i + 1}
                            </td>
                        ))}
                    </tr>
                    <tr>
                        <td className="text-nowrap text-muted">1 / 8</td>
                        {steps.map((_step, index) => (
                            <td
                                className={`text-nowrap text-center text-muted ${
                                    index === activeStepIndex
                                        ? 'bg-danger-subtle'
                                        : ''
                                }`}
                                key={index}
                                style={{ minWidth: '50px' }}
                            >
                                {index + 1}
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
