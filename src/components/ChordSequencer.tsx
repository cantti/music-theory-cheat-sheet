import { Button, Card, Form } from 'react-bootstrap';
import { pianoSynth } from '../audio/pianoSynth';
import { Chord, chord } from '../theory-utils/chord';
import { Note, n } from '../theory-utils/note';
import * as Tone from 'tone';
import { startTone } from '../audio/startTone';
import Table from 'react-bootstrap/Table';
import _ from 'lodash';
import { ReactElement, useState } from 'react';
import { Scale } from '../theory-utils/scale';

let currentStepIndex = 0;

interface Step {
    chord: Chord;
    length: number;
}

const scale = new Scale(n('C'), 'Major');

export function ChordSequencer() {
    const [steps, setSteps] = useState<(Step | null)[]>([
        { chord: chord(n('C'), 'Major').invert(1), length: 4 },
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
        { chord: chord(n('B'), 'Diminished'), length: 2 },
        null,
        null,
        null,
    ]);

    function repeat() {
        const step = steps[currentStepIndex];
        if (step) {
            pianoSynth.triggerAttackRelease(
                step.chord.notes.map((x) => x.format(true)),
                { '8n': step.length },
                Tone.now(),
                0.5
            );
        }

        currentStepIndex = (currentStepIndex + 1) % steps.length;
    }

    function handleStepDurationChange(
        targetStepIndex: number,
        e: React.FormEvent<HTMLSelectElement>
    ) {
        const newSteps: (Step | null)[] = [];
        const input = parseInt(e.currentTarget.value);
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
                    <Form.Group className="mb-3">
                        <Form.Label>Chord</Form.Label>
                        <Form.Select
                            size="sm"
                            className={
                                currentStep != null ? 'bg-success-subtle' : ''
                            }
                            onChange={(e) => {
                                setSteps(
                                    steps.map((step, stepIndex) =>
                                        stepIndex !== i
                                            ? step
                                            : e.target.value === '-1'
                                            ? null
                                            : {
                                                  chord: scale.chords[
                                                      parseInt(e.target.value)
                                                  ][0],
                                                  length: step?.length ?? 1,
                                              }
                                    )
                                );
                            }}
                            value={
                                currentStep
                                    ? scale.chords
                                          .map((x) => x[0])
                                          .findIndex((x) =>
                                              x.equals(currentStep?.chord!)
                                          )
                                    : -1
                            }
                        >
                            <option value="-1">Rest</option>
                            {scale.chords.map((chord, index) => (
                                <option value={index}>
                                    {chord[0].format('short')}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Duration</Form.Label>
                        <Form.Select
                            size="sm"
                            disabled={currentStep == null}
                            onChange={(e) => handleStepDurationChange(i, e)}
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

    return (
        <div>
            <h3>Chord Sequencer</h3>
            <Table bordered responsive>
                <tbody>
                    <tr>
                        {steps.map((_step, index) => (
                            <td
                                className="text-nowrap text-center text-muted"
                                key={index}
                                style={{ minWidth: '100px' }}
                            >
                                {index + 1}
                            </td>
                        ))}
                    </tr>
                    <tr>{getColumns()}</tr>
                </tbody>
            </Table>
            <button
                onClick={async () => {
                    await startTone();
                    Tone.Transport.cancel();
                    Tone.Transport.scheduleRepeat(repeat, '8n');
                    Tone.Transport.start();
                }}
            >
                Start
            </button>
        </div>
    );
}
