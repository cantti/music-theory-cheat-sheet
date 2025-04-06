import { Button, Col, Container, Form, Row } from 'react-bootstrap';
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
import { Draggable, DraggableData } from './Draggable';
import { Cell } from './Cell';
import { SequencerEvent } from './SequencerEvent';
import { SequencerRow } from './SequencerRow';
import { n } from '../../theory-utils/note';
import { ChordPicker } from './ChordPicker';
import { RiPlayMiniFill } from 'react-icons/ri';
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

export function ChordSequencer() {
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
  const [cellWidthPercent, setCellWidthPercentValue] = useState(50);
  const cellMinWidth = 40;
  const cellMaxWidth = 100;
  const cellWidth =
    (cellWidthPercent / 100) * (cellMaxWidth - cellMinWidth) + cellMinWidth;
  const cellEventHeight = 70;
  const cellHeight = 40;

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
      <Cell width={cellWidth} padding>
        1 / 4
      </Cell>,
    );
    for (let i = 0; i < duration; i++) {
      cells.push(
        <Cell width={cellWidth} padding>
          {i % 2 === 0 ? i / 2 : ''}
        </Cell>,
      );
    }
    return <SequencerRow height={cellHeight}>{cells}</SequencerRow>;
  }

  function getEighthsNotesRow() {
    const cells: ReactElement[] = [];
    cells.push(
      <Cell width={cellWidth} padding>
        1 / 8
      </Cell>,
    );
    for (let i = 0; i < duration; i++) {
      cells.push(
        <Cell key={i} width={cellWidth} padding>
          <AnimatePresence>
            {i === position ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                transition={{ duration: Tone.Time('8n').toSeconds() * 2 }}
                className="text-danger"
              >
                <RiPlayMiniFill />
              </motion.div>
            ) : (
              i
            )}
          </AnimatePresence>
        </Cell>,
      );
    }
    return <SequencerRow height={cellHeight}>{cells}</SequencerRow>;
  }

  function getEventCells() {
    const cells: ReactElement[] = [];
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      cells.push(
        <Draggable
          id={`draggable-${event.start.toString()}`}
          data={{ eventStart: event.start, action: 'moveStart' }}
          className="d-flex align-items-center bg-info-subtle border border-end-0 border-secondary border-2 ps-1"
          style={{
            width: cellWidth * (event.end - event.start + 1),
            left: cellWidth + event.start * cellWidth,
            position: 'absolute',
            height: '100%',
            fontSize: '0.9em',
          }}
          onClick={() => setEditedPosition(event.start)}
        >
          <div className="d-flex flex-column align-items-center gap-1 flex-fill overflow-hidden text-nowrap fw-bold">
            <motion.div
              key={event?.chord.format()}
              initial={{ scale: 0 }}
              animate={{
                scale: 1,
                transition: { duration: 0.3 },
              }}
            >
              {event?.chord.format('short')}
            </motion.div>
            {editedEvent === event.start && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{
                  scale: 1,
                  transition: { duration: 0.3 },
                }}
              >
                <BsPencilFill />
              </motion.div>
            )}
          </div>
          <Draggable
            id={`end-${event.start.toString()}`}
            className="bg-secondary"
            style={{
              width: 2,
              height: '100%',
              cursor: 'col-resize',
            }}
            data={{ eventStart: event.start, action: 'moveEnd' }}
          />
        </Draggable>,
      );
    }
    return cells;
  }

  function getEventsRow() {
    const cells: ReactElement[] = [];
    cells.push(<Cell width={cellWidth}></Cell>);
    for (let i = 0; i < duration; i++) {
      cells.push(
        <Cell width={cellWidth}>
          <Droppable
            id={`droppable-${i.toString()}`}
            data={{ index: i }}
            style={{
              width: '100%',
              height: '100%',
              cursor: 'pointer',
            }}
            className="d-flex align-items-center justify-content-center"
            onClick={() => setEditedPosition(i)}
          >
            {editedEvent === i && events.find((x) => x.start === i) == null && (
              <BsPencilFill />
            )}
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
            <Form.Text>{cellWidthPercent}%</Form.Text>
            <Form.Range
              min="0"
              max="100"
              value={cellWidthPercent}
              onChange={(e) =>
                setCellWidthPercentValue(parseInt(e.target.value))
              }
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
          <div
            className="d-inline-flex flex-column overflow-x-auto border-start border-top mb-3 noselect"
            style={{ maxWidth: '100%' }}
          >
            {getQuarterNotesRow()}
            {getEighthsNotesRow()}
            {getEventsRow()}
          </div>
        </DndContext>

        <p>Edit selected chord:</p>
        {editedEvent != null && (
          <ChordPicker
            editedChord={editedChord}
            onChordClick={(chord) => changeEventChord(editedEvent, chord)}
          />
        )}
      </Container>
    </>
  );
}
