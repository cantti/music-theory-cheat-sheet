import { useDroppable } from '@dnd-kit/core';

export interface DroppableData {
  index: number;
}

export interface DroppableProps {
  id: string;
  children?: React.ReactNode;
  className?: string;
  data: DroppableData;
  style?: React.CSSProperties;
}

export function Droppable(props: DroppableProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
    data: props.data,
  });

  const style = { ...props.style, color: isOver ? 'green' : undefined };

  return (
    <div ref={setNodeRef} style={style} className={props.className}>
      {props.children}
    </div>
  );
}
