import { Droppable } from './Droppable';
import { Draggable } from './Draggable';
import { SequencerEvent } from './SequencerEvent';
import { Button } from 'react-bootstrap';

interface CellProps {
  fill?: boolean;
  highlight?: boolean;
  children?: React.ReactNode;
}

export function Cell(props: CellProps) {
  return (
    <div
      className={`p-2 border-bottom text-center ${props.fill ? 'flex-fill' : ''} ${props.highlight ? 'bg-danger-subtle' : ''}`}
    >
      {props.children}
    </div>
  );
}

interface EventCellProps {
  event?: SequencerEvent;
  index: number;
  children?: React.ReactNode;
  onClick: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number,
  ) => void;
}

export function EventCell(props: EventCellProps) {
  const splitterWidth = 2;
  let eventClassName =
    'd-flex align-items-center justify-content-between flex-fill border-secondary border-2';
  if (props.event != null) {
    eventClassName += ' bg-info-subtle border-top border-bottom';
    if (props.event.start === props.index) {
      eventClassName += ' border-start';
    }
  }
  const chordButton = (
    <Button
      variant="secondary"
      className="rounded-0"
      size="sm"
      onClick={(e) => props.onClick(e, props.index)}
    >
      {props.event?.chord.format('short')}
    </Button>
  );
  return (
    <Droppable
      id={`droppable-${props.index.toString()}`}
      data={{ index: props.index }}
      className={eventClassName}
    >
      <div style={{ width: `${splitterWidth}px` }} />
      {props.event != null ? (
        <>
          {props.event.start === props.index && (
            <>
              <Draggable
                id={`position-${props.index.toString()}`}
                data={{ eventStart: props.event.start, action: 'moveStart' }}
                className="m-2"
              >
                {chordButton}
              </Draggable>
            </>
          )}
          {props.event.end === props.index && (
            <Draggable
              id={`end-${props.index.toString()}`}
              className="h-100 bg-secondary"
              style={{ width: `${splitterWidth}px` }}
              data={{ eventStart: props.event.start, action: 'moveEnd' }}
            />
          )}
        </>
      ) : (
        <>{chordButton}</>
      )}
      {(props.event == null || props.event.end !== props.index) && (
        <div style={{ width: `${splitterWidth}px` }} />
      )}
    </Droppable>
  );
}
