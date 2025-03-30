import { Button, Form } from 'react-bootstrap';
import { pianoSynth } from '../audio/pianoSynth';
import { Chord } from '../theory-utils/chord';
import * as Tone from 'tone';
import { startTone } from '../audio/startTone';
import Table from 'react-bootstrap/Table';
import _, { parseInt } from 'lodash';
import { ReactElement, useEffect, useState } from 'react';
import { allScales } from '../theory-utils/getScalesByNotes';
import { BsArrowsMove, BsPlayFill, BsStopFill } from 'react-icons/bs';
import {
  DndContext,
  DragEndEvent,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import { RiDraggable } from 'react-icons/ri';

function firstNotNullAfter<T>(
  arr: (T | null | undefined)[],
  startIndex: number,
): T | undefined {
  return arr
    .slice(startIndex + 1)
    .find((el): el is T => el !== null && el !== undefined);
}

interface Step {
  chord: Chord;
  length: number;
}

const defaultOctave = 4;

const numberOfStepsOptions = [4, 8, 16, 32, 64, 128];

interface DroppableProps {
  id: string;
  children: React.ReactNode;
  iStep: number;
}

function DroppableTd(props: DroppableProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
    data: {
      iStep: props.iStep,
    },
  });
  const style = {
    color: isOver ? 'green' : undefined,
  };

  return (
    <td ref={setNodeRef} style={style}>
      {props.children}
    </td>
  );
}

interface DraggableData {
  iStep: number;
}

interface DraggableProps {
  id: string;
  children: React.ReactNode;
  iStep: number;
  className?: string;
}

export function Draggable(props: DraggableProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
    data: {
      iStep: props.iStep,
    },
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      className={props.className}
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      {props.children}
    </div>
  );
}

export function ChordSequencer() {
  const [selectedScale, setSelectedScale] = useState<number>(0);
  const [stepsCount, setStepsCount] = useState<number>(32);

  const scale = allScales[selectedScale];

  const [steps, setSteps] = useState<(Step | null)[]>([
    { length: 8, chord: scale.chords[0][0] },
    ..._.fill(_.range(0, 7), null),
    { length: 8, chord: scale.chords[0][0] },
    ..._.fill(_.range(0, 7), null),
    { length: 8, chord: scale.chords[0][0] },
    ..._.fill(_.range(0, 7), null),
    { length: 8, chord: scale.chords[0][0] },
    ..._.fill(_.range(0, 7), null),
  ]);

  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const [bpm, setBpm] = useState(120);

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
    console.log(newSteps);

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

  function getDndColumns() {
    const columns: ReactElement[] = [];
    let notNullStep: Step | undefined;
    for (const [iStep, step] of steps.entries()) {
      if (step != null) {
        notNullStep = step;
      }
      columns.push(
        <DroppableTd id={`droppable-${iStep.toString()}`} iStep={iStep}>
          <div className="d-flex justify-content-center">
            {step !== null && (
              <>
                <Draggable
                  id={`start-${iStep.toString()}`}
                  iStep={iStep}
                  className="me-auto"
                >
                  <RiDraggable />
                </Draggable>
                <Draggable
                  id={`position-${iStep.toString()}`}
                  iStep={iStep}
                  className="mx-auto"
                >
                  <BsArrowsMove />
                </Draggable>
              </>
            )}
            {notNullStep != null &&
              steps.indexOf(notNullStep) + notNullStep.length - 1 == iStep && (
                <Draggable
                  id={`end-${iStep.toString()}`}
                  iStep={iStep}
                  className="ms-auto"
                >
                  <RiDraggable />
                </Draggable>
              )}
          </div>
        </DroppableTd>,
      );
    }
    return columns;
  }

  function getColumns() {
    const columns: ReactElement[] = [];
    let notNullStep: Step | null = null;
    for (const [iStep, step] of steps.entries()) {
      if (step != null) {
        notNullStep = step;
      }
      if (
        step == null &&
        notNullStep != null &&
        iStep < steps.indexOf(notNullStep) + notNullStep.length
      ) {
        continue;
      }
      columns.push(
        <td
          key={iStep}
          className={
            activeStepIndex >= iStep &&
            activeStepIndex < iStep + (steps[iStep]?.length ?? 1)
              ? 'bg-secondary-subtle'
              : ''
          }
          colSpan={step?.length}
        >
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
                            chord:
                              scale.chords[val][0].setOctave(defaultOctave),
                            length: step?.length ?? 1,
                          }
                      : step,
                  ),
                );
              }}
              value={
                step == null
                  ? '-1'
                  : scale.chords.findIndex((x) => x[0].equals(step!.chord))
              }
            >
              <option value="-1">-</option>
              {scale.chords.map((chord, i) => (
                <option value={i} key={i}>
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
                          chord: step.chord.setOctave(parseInt(e.target.value)),
                          length: step?.length ?? 1,
                        }
                      : step,
                  ),
                );
              }}
              value={step?.chord.tonic.octave ?? defaultOctave}
            >
              {[2, 3, 4, 5].map((i) => (
                <option value={i} key={i}>
                  {i}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Duration</Form.Label>
            <Form.Select
              size="sm"
              disabled={step == null}
              onChange={(e) =>
                handleStepDurationChange(iStep, parseInt(e.target.value))
              }
              value={step?.length ?? 1}
            >
              {_.range(1, steps.length + 1).map((i) => (
                <option value={i} key={i}>
                  {i}
                </option>
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
              const notes = step.chord.notes.map((x) => x.format(true));
              pianoSynth.triggerAttack(notes);
              Tone.Transport.schedule(() => pianoSynth.triggerRelease(notes), {
                '8n': (i + step.length) * 0.99,
              });
            }
            setActiveStepIndex(i);
          }
        },
        { '8n': i },
      );
    }
  }, [steps]);

  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  }, [bpm]);

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

  function handleDragEnd(event: DragEndEvent) {
    const iActiveStep = event.active.data.current?.iStep as number;
    const iTargetStep = event.over?.data.current?.iStep as number;
    console.log(iActiveStep, iTargetStep);
    const newSteps = [...steps];
    [newSteps[iActiveStep], newSteps[iTargetStep]] = [
      newSteps[iTargetStep],
      newSteps[iActiveStep],
    ];
    if (
      iTargetStep + (newSteps[iTargetStep]?.length ?? 1) >
      newSteps.indexOf(firstNotNullAfter(newSteps, iTargetStep) ?? null)
    ) {
      newSteps[iTargetStep].length = 1;
    }
    setSteps(newSteps);
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
            <option value={index} key={index}>
              {scale.format('long')}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Steps (1/8)</Form.Label>
        <Form.Select
          size="sm"
          onChange={(e) => handleStepsCountChange(parseInt(e.target.value))}
          value={stepsCount}
        >
          {numberOfStepsOptions.map((option, index) => (
            <option value={option} key={index}>
              {option}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>BPM</Form.Label>
        <Form.Range
          min="1"
          max="300"
          value={bpm}
          onChange={(e) => setBpm(parseInt(e.target.value))}
        />
        <Form.Text>{bpm}</Form.Text>
      </Form.Group>

      <p>Sequencer</p>
      <DndContext onDragEnd={handleDragEnd}>
        <Table
          bordered
          responsive
          size="sm"
          style={{ tableLayout: 'fixed', width: '200%' }}
        >
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
                    i === activeStepIndex ? 'bg-secondary-subtle' : ''
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
              {getDndColumns()}
            </tr>
            <tr>
              <td></td>
              {getColumns()}
            </tr>
          </tbody>
        </Table>
      </DndContext>
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
