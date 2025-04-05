import { Draggable } from './Draggable';
import { SequencerEvent } from './SequencerEvent';
import { Button } from 'react-bootstrap';

interface CellProps {
  highlight?: boolean;
  children?: React.ReactNode;
  width: number;
  padding?: boolean;
}

export function Cell(props: CellProps) {
  return (
    <div
      className={`border-bottom border-end text-center flex-shrink-0 ${props.highlight ? 'bg-danger-subtle' : ''} ${props.padding ? 'p-2' : ''}`}
      style={{ width: props.width, height: '100%' }}
    >
      {props.children}
    </div>
  );
}

interface EventCellProps {
  event: SequencerEvent;
  children?: React.ReactNode;
  onClick: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number,
  ) => void;
  width: number;
}

export function EventCell(props: EventCellProps) {
  const splitterWidth = 2;
  return (
    <Draggable
      id={`draggable-${props.event.start.toString()}`}
      data={{ eventStart: props.event.start, action: 'moveStart' }}
      className={
        'd-flex align-items-center justify-content-between bg-info-subtle border border-end-0 border-secondary border-2 ps-1'
      }
      style={{
        width: props.width * (props.event.end - props.event.start + 1),
        left: props.width + props.event.start * props.width,
        position: 'absolute',
        height: '100%',
      }}
    >
      <Button
        variant="secondary"
        className="rounded-0"
        size="sm"
        onClick={(e) => props.onClick(e, props.event.start)}
      >
        {props.event?.chord.format('short')}
      </Button>
      <Draggable
        id={`end-${props.event.start.toString()}`}
        className="bg-secondary"
        style={{
          width: `${splitterWidth}px`,
          height: '100%',
          cursor: 'col-resize',
        }}
        data={{ eventStart: props.event.start, action: 'moveEnd' }}
      />
    </Draggable>
  );
}
