import { Button, Form } from 'react-bootstrap';
import { pianoSynth } from '../../audio/pianoSynth';
import { Chord } from '../../theory-utils/chord';
import * as Tone from 'tone';
import { startTone } from '../../audio/startTone';
import Table from 'react-bootstrap/Table';
import _, { parseInt } from 'lodash';
import { ReactElement, useEffect, useState } from 'react';
import { allScales } from '../../theory-utils/getScalesByNotes';
import { BsPlayFill, BsStopFill } from 'react-icons/bs';
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { RiDraggable } from 'react-icons/ri';
import { DroppableData, Droppable } from './Droppable';
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
    for (let i = 0; i <= eventsCount; i++) {
      Tone.Transport.schedule(
        () => {
          if (i === eventsCount) {
            Tone.Transport.stop();
            setActiveStepIndex(0);
          } else {
            const event = events.find((x) => x.start === i);
            if (event) {
              const notes = event.chord.notes.map((x) => x.format(true));
              pianoSynth.triggerAttack(notes);
              Tone.Transport.schedule(() => pianoSynth.triggerRelease(notes), {
                '8n': (event.end - event.start) * 0.99,
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
    const eventToMove = events.find((x) => x.start == from)!;
    eventToMove.start = to;
    eventToMove.end = eventToMove.end + to - from;
    let newEvents = events.filter((x) => x.start != to && x.start != from);
    newEvents.push(eventToMove);
    newEvents = fixOverlaps(newEvents);
    setEvents(newEvents);
  }

  function handleDragEnd(event: DragEndEvent) {
    const draggableData = event.active.data.current as DraggableData;
    const droppableData = event.over?.data.current as DroppableData;
    if (draggableData.action == 'move') {
      move(draggableData.index, droppableData.index);
    }
    return;
  }

  function fixOverlaps(events: Event[]) {
    if (events.length < 2) return events;
    events = _.orderBy(events, (x) => x.start);
    for (let i = 1; i < events.length; i++) {
      const prevEvent = events[i - 1];
      const event = events[i];
      if (prevEvent != null && prevEvent.end > event.start) {
        prevEvent.end = event.start;
      }
    }
    return events;
  }

  // @ts-ignore
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

  // https://github.com/clauderic/dnd-kit/issues/800
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  function getDndColumns() {
    const columns: ReactElement[] = [];
    let event: Event | undefined;
    for (let i = 0; i < eventsCount; i++) {
      if (event != null && event.end <= i) {
        event = undefined;
      }
      event = events.find((x) => x.start == i) ?? event;
      columns.push(
        <td
          className={event != null ? 'bg-secondary-subtle p-0' : 'p-0'}
          style={{ height: '50px' }}
        >
          <Droppable
            id={`droppable-${i.toString()}`}
            data={{ index: i }}
            style={{ height: '100%' }}
            className="d-flex align-items-center justify-content-center"
          >
            {event != null ? (
              <>
                {event.start == i && (
                  <>
                    <Draggable
                      id={`position-${i.toString()}`}
                      data={{ index: i, action: 'move' }}
                      className="m-2"
                    >
                      <Button
                        variant="secondary"
                        size="sm"
                        className="rounded-0 d-flex flex-column align-items-center"
                        onClick={() => {
                          console.log('click');
                        }}
                      >
                        <RiDraggable />
                        <div>{event?.chord.format('long')}</div>
                      </Button>
                    </Draggable>
                    <div></div>
                  </>
                )}
                {event.end - 1 == i && (
                  <Draggable
                    id={`end-${i.toString()}`}
                    className="ms-auto h-100 bg-secondary"
                    style={{ width: '2px' }}
                    data={{ index: i, action: 'resize' }}
                  ></Draggable>
                )}
              </>
            ) : (
              'choose'
            )}
          </Droppable>
        </td>,
      );
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
      <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
        <Table
          bordered
          responsive
          size="sm"
          style={{ tableLayout: 'fixed', width: `${90 * eventsCount}px` }}
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
            {/* <tr> */}
            {/*   <td></td> */}
            {/*   {getColumns()} */}
            {/* </tr> */}
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
