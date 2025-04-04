import { Button, Card, Form } from 'react-bootstrap';
import { pianoSynth } from '../../audio/pianoSynth';
import { Chord } from '../../theory-utils/chord';
import * as Tone from 'tone';
import { startTone } from '../../audio/startTone';
import Table from 'react-bootstrap/Table';
import _, { parseInt } from 'lodash';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { allScales } from '../../theory-utils/getScalesByNotes';
import { BsPlayFill, BsStopFill } from 'react-icons/bs';
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
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

  const [chordPicker, setChordPicker] = useState({
    x: 0,
    y: 0,
    show: false,
    at: 0,
  });
  const chordPickerRef = useRef<HTMLDivElement | null>(null);

  const scale = allScales[selectedScale];
  const [events, setEvents] = useState<Event[]>([
    { start: 0, end: 7, chord: scale.chords[0][0] },
    { start: 8, end: 15, chord: scale.chords[3][0] },
    { start: 16, end: 23, chord: scale.chords[4][0] },
    { start: 24, end: 31, chord: scale.chords[4][0] },
  ]);
  const [position, setActiveStepIndex] = useState(0);
  const [bpm, setBpm] = useState(120);

  //#region Transport
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
                '8n': (event.end + 1) * 0.99,
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
  //#endregion

  //#region Change Events
  function changeEventChord(start: number, chord?: Chord) {
    let newEvents = _(events).cloneDeep();
    const event = newEvents.find((x) => x.start === start);
    if (chord == null) {
      // remove event with chord
      newEvents = newEvents.filter((x) => x !== event);
    } else if (event != null) {
      // change chord of event
      event.chord = chord;
    } else {
      // add new event
      newEvents.push({
        start: start,
        end: start,
        chord: chord,
      });
    }
    setEvents(newEvents);
  }

  function moveEventStart(start: number, newStart: number) {
    let newEvents = _(events)
      // remove existing event
      .filter((x) => x.start !== newStart)
      .cloneDeep();
    const event = newEvents.find((x) => x.start === start)!;
    event.start = newStart;
    event.end = event.end + newStart - start;
    newEvents = fixOverlaps(newEvents);
    setEvents(newEvents);
  }

  function moveEventEnd(start: number, newEnd: number) {
    if (newEnd < start) return;
    let newEvents = _(events).cloneDeep();
    const event = newEvents.find((x) => x.start === start)!;
    event.end = newEnd;
    newEvents = fixOverlaps(newEvents);
    setEvents(newEvents);
  }
  //#endregion

  function handleDragEnd(event: DragEndEvent) {
    const draggableData = event.active.data.current as DraggableData;
    const droppableData = event.over?.data.current as DroppableData;
    if (draggableData.action === 'moveStart') {
      moveEventStart(draggableData.eventStart, droppableData.index);
    } else if (draggableData.action === 'moveEnd') {
      moveEventEnd(draggableData.eventStart, droppableData.index);
    }
    return;
  }

  function fixOverlaps(events: Event[]) {
    if (events.length < 2) return events;
    events = _(events)
      .orderBy((x) => x.start)
      .cloneDeep();
    for (let i = 1; i < events.length; i++) {
      const prevEvent = events[i - 1];
      const event = events[i];
      if (prevEvent != null && prevEvent.end >= event.start) {
        prevEvent.end = event.start - 1;
      }
    }
    return events;
  }

  // https://github.com/clauderic/dnd-kit/issues/800
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  function showChordPicker(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    at: number,
  ) {
    const pickerW = chordPickerRef.current
      ? chordPickerRef.current.getBoundingClientRect().width
      : 0;
    const pickerH = chordPickerRef.current
      ? chordPickerRef.current.getBoundingClientRect().height
      : 0;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const offset = 10;
    const x = Math.min(e.clientX - offset, screenWidth - pickerW); // Prevent going off the right side
    const y = Math.min(e.clientY - offset, screenHeight - pickerH); // Prevent going off the bottom side
    setChordPicker({
      x: x,
      y: y,
      show: true,
      at: at,
    });
  }

  const splitterWidth = 2;
  const eventWidth = 60;

  function getColumns() {
    const columns: ReactElement[] = [];
    let event: Event | undefined;
    for (let i = 0; i < eventsCount; i++) {
      if (event != null && event.end < i) {
        event = undefined;
      }
      event = events.find((x) => x.start == i) ?? event;

      const chordButton = (
        <Button
          variant="secondary"
          className="rounded-0"
          size="sm"
          onClick={(e) => showChordPicker(e, i)}
          style={{ maxWidth: `${eventWidth - splitterWidth * 2 - 20}px` }}
        >
          {event?.chord.format('short')}
        </Button>
      );

      columns.push(
        <td
          key={i}
          className={event != null ? 'bg-secondary-subtle p-0' : 'p-0'}
          style={{ height: '50px' }}
        >
          <Droppable
            id={`droppable-${i.toString()}`}
            data={{ index: i }}
            style={{ height: '100%' }}
            className="d-flex align-items-center justify-content-between"
          >
            <div style={{ width: `${splitterWidth}px` }} />
            {event != null ? (
              <>
                {event.start == i && (
                  <>
                    <Draggable
                      id={`position-${i.toString()}`}
                      data={{ eventStart: event.start, action: 'moveStart' }}
                      className="m-2"
                    >
                      {chordButton}
                    </Draggable>
                  </>
                )}
                {event.end == i ? (
                  <Draggable
                    id={`end-${i.toString()}`}
                    className="h-100 bg-secondary"
                    style={{ width: `${splitterWidth}px` }}
                    data={{ eventStart: event.start, action: 'moveEnd' }}
                  />
                ) : (
                  <div style={{ width: `${splitterWidth}px` }} />
                )}
              </>
            ) : (
              <>
                {chordButton}
                <div style={{ width: `${splitterWidth}px` }} />
              </>
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

      <Card
        body
        style={{
          position: 'fixed',
          left: `${chordPicker.x}px`,
          top: `${chordPicker.y}px`,
          visibility: chordPicker.show ? 'visible' : 'hidden',
        }}
        onMouseLeave={() => setChordPicker({ ...chordPicker, show: false })}
        ref={chordPickerRef}
      >
        <div className="mb-2 d-flex flex-column gap-1">
          <Button
            variant="outline-danger"
            onClick={() => {
              changeEventChord(chordPicker.at, undefined);
              setChordPicker({ ...chordPicker, show: false });
            }}
          >
            x
          </Button>
          {scale.chords.map((chord, i) => (
            <Button
              key={i}
              variant="outline-secondary"
              active={
                events.find((x) => x.start == chordPicker.at) &&
                chord[0].equals(
                  events.find((x) => x.start == chordPicker.at)!.chord,
                )
              }
              onClick={() => {
                changeEventChord(chordPicker.at, chord[0]);
                setChordPicker({ ...chordPicker, show: false });
              }}
            >
              {chord[0].format('long')}
            </Button>
          ))}
        </div>
      </Card>

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
          onChange={(e) => setEventsCount(parseInt(e.target.value))}
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
          style={{
            tableLayout: 'fixed',
            width: `${eventWidth * eventsCount}px`,
          }}
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
                    i === position ? 'bg-danger-subtle' : ''
                  }`}
                  key={i}
                >
                  {i}
                </td>
              ))}
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
