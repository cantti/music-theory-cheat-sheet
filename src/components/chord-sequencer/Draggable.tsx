import { useDraggable } from '@dnd-kit/core';

export interface DraggableData {
    index: number;
    action: 'move' | 'resize';
}
interface DraggableProps {
    id: string;
    children: React.ReactNode;
    className?: string;
    data: DraggableData;
}

export function Draggable(props: DraggableProps) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: props.id,
        data: props.data,
    });
    const style = transform
        ? {
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        }
        : undefined;

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

