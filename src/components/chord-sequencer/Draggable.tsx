import { useDraggable } from '@dnd-kit/core';

export interface DraggableData {
  eventStart: number;
  action: 'moveStart' | 'moveEnd';
}

interface DraggableProps {
  id: string;
  children?: React.ReactNode;
  className?: string;
  data: DraggableData;
  style?: React.CSSProperties;
}

export function Draggable(props: DraggableProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: props.id,
      data: props.data,
    });

  const style = {
    ...props.style,
    zIndex: isDragging ? 1 : 0,
    transform: transform ? `translate3d(${transform.x}px, 0, 0)` : undefined,
  };

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
