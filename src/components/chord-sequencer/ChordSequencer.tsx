import { Button, Form } from 'react-bootstrap';
import { pianoSynth } from '../../audio/pianoSynth';
import { Chord } from '../../theory-utils/chord';
import * as Tone from 'tone';
import { startTone } from '../../audio/startTone';
import Table from 'react-bootstrap/Table';
import _, { parseInt } from 'lodash';
import { ReactElement, useEffect, useState } from 'react';
import { allScales } from '../../theory-utils/getScalesByNotes';
import { BsArrowsMove, BsPlayFill, BsStopFill } from 'react-icons/bs';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { RiDraggable } from 'react-icons/ri';
import { DroppableData, DroppableTd } from './DroppableTd';
import { Draggable, DraggableData } from './Draggable';

interface Event {
  chord: Chord;
  start: number;
  end: number;
}

const numberOfStepsOptions = [4, 8, 16, 32, 64, 128];

export function ChordSequencer() {
  const [selectedScale, setSelectedScale] = useState<number>(0);
  const [eventsCount, setEventsCount] = useState<number>(32);

  const scale = allScales[selectedScale];

  const [events, setEvents] = useState<Event[]>([
    { start: 0, end: 4, chord: scale.chords[0][0] },
    { start: 8, end: 16, chord: scale.chords[0][0] },
    { start: 16, end: 24, chord: scale.chords[0][0] },
    { start: 24, end: 32, chord: scale.chords[0][0] },
  ]);

  const [position, setActiveStepIndex] = useState(0);

  const [bpm, setBpm] = useState(120);

  function handleStepsCountChange(newStepsCount: number) {
    setEventsCount(newStepsCount);
    let newSteps = events.slice(0, newStepsCount);
    if (newStepsCount > events.length) {
      newSteps = [
        ...newSteps,
        ...new Array(newStepsCount - events.length).fill(null),
      ];
    }
    setEvents(newSteps);
  }

  function handleChordChange(at: number, chord: Chord) {
    const newEvent: Event = {
      start: at,
      end: at + 1,
      chord: chord,
    };
    const newEvents = [...events];
    const oldEvent = events.find((x) => x.start == at);
    if (oldEvent != null) {
      newEvent.end = oldEvent.end;
      newEvents[events.indexOf(oldEvent)] = newEvent;
    } else {
      newEvents.push(newEvent);
    }
    setEvents(newEvents);
  }

  useEffect(() => {
    Tone.Transport.cancel();
    pianoSynth.releaseAll();
    for (let i = 0; i <= events.length; i++) {
      Tone.Transport.schedule(
        () => {
          if (i === events.length) {
            Tone.Transport.stop();
            setActiveStepIndex(0);
          } else {
            const step = events[i];
            if (step) {
              const notes = step.chord.notes.map((x) => x.format(true));
              pianoSynth.triggerAttack(notes);
              Tone.Transport.schedule(() => pianoSynth.triggerRelease(notes), {
                // '8n': (i + step.length) * 0.99,
              });
            }
            setActiveStepIndex(i);
          }
        },
        { '8n': i },
      );
    }
  }, [events]);

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

  function move(from: number, to: number) {
    console.log(from, to);
  }

  function handleDragEnd(event: DragEndEvent) {
    const draggableData = event.active.data.current as DraggableData;
    const droppableData = event.over?.data.current as DroppableData;
    if (draggableData.action == 'move') {
      move(draggableData.index, droppableData.index);
    }
    return;
  }

  // function fixOverlaps() {
  //   let nn: number | undefined;
  //   for (let i = 0; i < steps.length; i++) {
  //     if (nn == null && steps[i] != null) {
  //       nn = i;
  //       continue;
  //     }
  //     if (steps[i] != null && nn + steps[nn]) {
  //     }
  //   }
  // }

  function getColumns() {
    const columns: ReactElement[] = [];
    let prevEvent: Event | undefined;
    for (let i = 0; i < eventsCount; i++) {
      let event = events.find((x) => x.start == i);
      if (prevEvent != null && prevEvent.end > i) continue;
      columns.push(
        <td key={i} colSpan={event != null ? event.end - event.start : 1}>
          <div className="mb-3 h2">
            {event?.chord.format('short') ?? <>&nbsp;</>}
          </div>
          <Form.Group className="mb-3">
            <Form.Label>Chord</Form.Label>
            <Form.Select
              size="sm"
              onChange={(e) =>
                handleChordChange(i, scale.chords[parseInt(e.target.value)][0])
              }
              value={
                event == null
                  ? '-1'
                  : scale.chords.findIndex((x) => x[0].equals(event!.chord))
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
          {/*
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
          */}
        </td>,
      );
      prevEvent = event ?? prevEvent;
    }
    return columns;
  }

  function getDndColumns() {
    const columns: ReactElement[] = [];
    let prevEvent: Event | undefined;
    for (let i = 0; i < eventsCount; i++) {
      let event = events.find((x) => x.start == i);
      columns.push(
        <DroppableTd id={`droppable-${i.toString()}`} data={{ index: i }}>
          <div className="d-flex">
            {event != null && (
              <>
                <Draggable
                  id={`position-${i.toString()}`}
                  data={{ index: i, action: 'move' }}
                >
                  <BsArrowsMove />
                </Draggable>
              </>
            )}
            {prevEvent != null && prevEvent.end - 1 == i && (
              <Draggable
                id={`end-${i.toString()}`}
                className="ms-auto"
                data={{ index: i, action: 'resize' }}
              >
                <RiDraggable />
              </Draggable>
            )}
          </div>
        </DroppableTd>,
      );
      prevEvent = event ?? prevEvent;
    }
    return columns;
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
          value={eventsCount}
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
              {_.range(0, eventsCount / 2).map((index) => (
                <td
                  className={`text-nowrap text-center text-muted`}
                  key={index}
                  colSpan={2}
                >
                  {index}
                </td>
              ))}
            </tr>
            <tr>
              <td className="text-nowrap text-muted">1 / 8</td>
              {_.range(0, eventsCount).map((_step, i) => (
                <td
                  className={`text-nowrap text-center text-muted ${
                    i === position ? 'bg-secondary-subtle' : ''
                  }`}
                  key={i}
                  style={{ minWidth: '50px' }}
                >
                  {i}
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
