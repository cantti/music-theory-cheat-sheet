import { Draggable } from './Draggable';
import { SequencerEvent } from './SequencerEvent';
import { motion } from 'motion/react';
import { BsPencilFill } from 'react-icons/bs';

interface CellProps {
  children?: React.ReactNode;
  cellWidth: number;
  col: number;
}

export function Cell(props: CellProps) {
  return (
    <div
      className={
        'border-bottom border-end d-flex align-items-center justify-content-center text-nowrap overflow-hidden'
      }
      style={{
        width: `${props.cellWidth}%`,
        height: '100%',
        position: 'absolute',
        left: `${props.cellWidth * props.col}%`,
      }}
    >
      {props.children}
    </div>
  );
}

interface EventCellProps {
  event: SequencerEvent;
  edited: boolean;
  cellWidth: number;
  children?: React.ReactNode;
  onClick: () => void;
}

export function EventCell(props: EventCellProps) {
  return (
    <Draggable
      id={`draggable-${props.event.start.toString()}`}
      data={{ eventStart: props.event.start, action: 'moveStart' }}
      className="d-flex align-items-center bg-warning-subtle border border-end-0 border-secondary border-2 ps-1"
      style={{
        width: `${props.cellWidth * (props.event.end - props.event.start + 1)}%`,
        left: `${(props.event.start + 1) * props.cellWidth}%`,
        position: 'absolute',
        height: '100%',
        fontSize: '0.9em',
        opacity: 0.7,
      }}
      onClick={() => props.onClick()}
    >
      <div className="d-flex flex-column align-items-center gap-1 flex-fill overflow-hidden text-nowrap fw-bold">
        <motion.div
          key={props.event.chord.format()}
          initial={{ scale: 0 }}
          animate={{
            scale: 1,
            transition: { duration: 0.3 },
          }}
        >
          {props.event.chord.format('short')}
        </motion.div>
        {props.edited && (
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
        id={`end-${props.event.start.toString()}`}
        className="bg-secondary"
        style={{
          width: 2,
          height: '100%',
          cursor: 'col-resize',
        }}
        data={{ eventStart: props.event.start, action: 'moveEnd' }}
      />
    </Draggable>
  );
}
