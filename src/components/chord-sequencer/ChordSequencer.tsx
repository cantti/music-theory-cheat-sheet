import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { pianoSynth } from '../../audio/pianoSynth';
import { Chord } from '../../theory-utils/chord';
import * as Tone from 'tone';
import { startTone } from '../../audio/startTone';
import _, { parseInt } from 'lodash';
import { ReactElement, useEffect, useState } from 'react';
import {
  BsGrid3X3Gap,
  BsPencilFill,
  BsPlayFill,
  BsSpeedometer2,
  BsStopFill,
  BsZoomIn,
} from 'react-icons/bs';
import {
  Collision,
  CollisionDetection,
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Droppable, DroppableData } from './Droppable';
import { DraggableData } from './Draggable';
import { Cell, EventCell } from './Cell';
import { SequencerEvent } from './SequencerEvent';
import { SequencerRow } from './SequencerRow';
import { n } from '../../theory-utils/note';
import { ChordPicker } from './ChordPicker';
import { AnimatePresence, motion } from 'motion/react';

const customCollisionDetection: CollisionDetection = ({
  collisionRect,
  droppableRects,
  droppableContainers,
}) => {
  const collisions: Collision[] = [];
  for (const droppable of droppableContainers.values()) {
    const rect = droppableRects.get(droppable.id);
    if (!rect) continue;
    const isWithinBounds =
      collisionRect.left >= rect.left && collisionRect.left <= rect.right;
    if (isWithinBounds) {
      collisions.push({
        id: droppable.id,
        data: {
          droppable,
        },
      });
    }
  }

  return collisions;
};

const numberOfStepsOptions = [4, 8, 16, 32, 64, 128];

export default function ChordSequencer() {
  const [duration, setDuration] = useState<number>(32);

  const [events, setEvents] = useState<SequencerEvent[]>([
    { start: 0, end: 7, chord: new Chord(n('C'), 'Major') },
    { start: 8, end: 15, chord: new Chord(n('F'), 'Major', -1) },
    { start: 16, end: 23, chord: new Chord(n('G'), 'Major', -1) },
    { start: 24, end: 31, chord: new Chord(n('G'), 'Major', -1) },
  ]);

  const [editedEvent, setEditedPosition] = useState<number | undefined>(
    undefined,
  );
  const editedChord = events.find((x) => x.start == editedEvent)?.chord;

  const [position, setPosition] = useState(0);
  const [bpm, setBpm] = useState(120);

  // event width (zoom)
  const [minZoom, maxZoom] = [50, 200]; // %
  const [zoom, setZoom] = useState(100); // %
  const cellWidth = 100 / (duration + 1); // %
  const cellEventHeight = 70; // px
  const cellHeight = 40; // px

  //#region Transport
  useEffect(() => {
    Tone.Transport.cancel();
    Tone.Transport.loop = true;
    Tone.Transport.loopStart = 0;
    Tone.Transport.loopEnd = { '8n': duration };
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const notes = event.chord.notes.map((x) => x.format(true));
      Tone.Transport.schedule(() => pianoSynth.triggerAttack(notes), {
        '8n': event.start,
      });
      Tone.Transport.schedule(() => pianoSynth.releaseAll(), {
        '8n': (event.end + 1) * 0.99,
      });
    }
    for (let i = 0; i < duration; i++) {
      Tone.Transport.schedule(() => setPosition(i), {
        '8n': i,
      });
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
      setPosition(0);
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
      setEditedPosition(undefined);
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
    if (start == newStart) return;
    let newEvents = _(events)
      // remove existing event
      .filter((x) => x.start !== newStart)
      .cloneDeep();
    const event = newEvents.find((x) => x.start === start)!;
    event.start = newStart;
    event.end = event.end + newStart - start;
    newEvents = fixOverlaps(newEvents);
    setEvents(newEvents);
    setEditedPosition(event.start);
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
  }

  function fixOverlaps(events: SequencerEvent[]) {
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

  function handleDurationChange(newValue: number) {
    setDuration(newValue);
    setEvents([]);
  }

  function getQuarterNotesRow() {
    const cells: ReactElement[] = [];
    cells.push(
      <Cell key={0} cellWidth={cellWidth} col={0}>
        1 / 4
      </Cell>,
    );
    for (let i = 0; i < duration; i++) {
      cells.push(
        <Cell key={i} cellWidth={cellWidth} col={i + 1}>
          {i % 2 === 0 ? i / 2 : ''}
        </Cell>,
      );
    }
    return <SequencerRow height={cellHeight}>{cells}</SequencerRow>;
  }

  function getEighthsNotesRow() {
    const cells: ReactElement[] = [];
    cells.push(
      <Cell key={0} cellWidth={cellWidth} col={0}>
        1 / 8
      </Cell>,
    );
    for (let i = 0; i < duration; i++) {
      cells.push(
        <Cell key={i} cellWidth={cellWidth} col={i + 1}>
          {i}
        </Cell>,
      );
    }
    return <SequencerRow height={cellHeight}>{cells}</SequencerRow>;
  }

  function getPlayHeadRow() {
    const cells: ReactElement[] = [];
    cells.push(<Cell key={0} cellWidth={cellWidth} col={0}></Cell>);
    for (let i = 1; i < duration + 1; i++) {
      cells.push(
        <Cell key={i} cellWidth={cellWidth} col={i}>
          <AnimatePresence>
            {i === position && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                transition={{ duration: Tone.Time('8n').toSeconds() * 2 }}
                style={{ width: '100%', height: '100%' }}
                className="bg-danger"
              ></motion.div>
            )}
          </AnimatePresence>
        </Cell>,
      );
    }
    return <SequencerRow height={10}>{cells}</SequencerRow>;
  }

  function getEventCells() {
    const cells: ReactElement[] = [];
    for (let pos = 0; pos < events.length; pos++) {
      const event = events[pos];
      cells.push(
        <EventCell
          key={pos}
          edited={editedEvent === event.start}
          onClick={() => setEditedPosition(event.start)}
          cellWidth={cellWidth}
          event={event}
        />,
      );
    }
    return cells;
  }

  function getEventsRow() {
    const cells: ReactElement[] = [];
    cells.push(<Cell cellWidth={cellWidth} col={0}></Cell>);
    for (let pos = 0; pos < duration; pos++) {
      cells.push(
        <Cell key={pos} cellWidth={cellWidth} col={pos + 1}>
          <Droppable
            id={`droppable-${pos.toString()}`}
            data={{ index: pos }}
            style={{
              width: '100%',
              height: '100%',
              cursor: 'pointer',
            }}
            className="d-flex align-items-center justify-content-center"
            onClick={() => setEditedPosition(pos)}
          >
            {editedEvent === pos &&
              events.find((x) => x.start === pos) == null && <BsPencilFill />}
          </Droppable>
        </Cell>,
      );
    }
    return (
      <SequencerRow height={cellEventHeight}>
        {cells}
        {getEventCells()}
      </SequencerRow>
    );
  }

  const dndSensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  return (
    <>
      <Container fluid>
        <h3>Chord Sequencer</h3>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column>
            <BsGrid3X3Gap /> Duration
          </Form.Label>
          <Col sm="10">
            <Form.Select
              size="sm"
              onChange={(e) => handleDurationChange(parseInt(e.target.value))}
              value={duration}
            >
              {numberOfStepsOptions.map((option, index) => (
                <option value={option} key={index}>
                  {option}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column>
            <BsSpeedometer2 /> BPM
          </Form.Label>
          <Col sm="10">
            <Form.Text>{bpm}</Form.Text>
            <Form.Range
              min="1"
              max="300"
              value={bpm}
              onChange={(e) => setBpm(parseInt(e.target.value))}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column>
            <BsZoomIn /> Zoom
          </Form.Label>
          <Col sm="10">
            <Form.Text>{zoom}%</Form.Text>
            <Form.Range
              min={minZoom}
              max={maxZoom}
              value={zoom}
              onChange={(e) => setZoom(parseInt(e.target.value))}
            />
          </Col>
        </Form.Group>

        <div className="d-flex align-items-center gap-3 mb-3">
          <div>Sequencer</div>
          <Button variant="dark" size="sm" onClick={play}>
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

        <DndContext
          collisionDetection={customCollisionDetection}
          onDragEnd={handleDragEnd}
          sensors={dndSensors}
        >
          {/* div with scrollbar */}
          <div className="overflow-x-auto mb-3 noselect">
            {/* sequencer */}
            <div
              className="d-flex flex-column border-top border-start"
              style={{ width: `${zoom}%` }}
            >
              {getPlayHeadRow()}
              {getQuarterNotesRow()}
              {getEighthsNotesRow()}
              {getEventsRow()}
            </div>
          </div>
        </DndContext>

        {editedEvent == null ? (
          <Alert variant="info">
            Click on a cell in the grid to edit or create a chord.
          </Alert>
        ) : (
          <>
            <p>Edit selected chord:</p>
            <ChordPicker
              editedChord={editedChord}
              onChordClick={(chord) => changeEventChord(editedEvent, chord)}
            />
          </>
        )}
      </Container>
    </>
  );
}
