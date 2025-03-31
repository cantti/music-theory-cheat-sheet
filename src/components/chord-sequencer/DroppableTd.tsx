import { useDroppable } from '@dnd-kit/core';

export interface DroppableData {
  index: number;
}

export interface DroppableProps {
  id: string;
  children: React.ReactNode;
  data: DroppableData;
}

export function DroppableTd(props: DroppableProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
    data: props.data,
  });
  const style = {
    color: isOver ? 'green' : undefined,
  };

  return (
    <td ref={setNodeRef} style={style}>
      {props.children}
    </td>
  );
}
