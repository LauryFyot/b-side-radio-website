import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { getMediaItemKey } from '../utils/adminHelpers';

export default function SortableMediaGrid({ items, onReorder, className, children }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={({ active, over }) => {
        if (over && active.id !== over.id) onReorder(active.id, over.id);
      }}
    >
      <SortableContext items={items.map(getMediaItemKey)} strategy={rectSortingStrategy}>
        <div className={className}>{children}</div>
      </SortableContext>
    </DndContext>
  );
}

export function SortableMediaCard({ id, label, className, disabled = false, children }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id, disabled });
  const handle = (
    <button
      {...attributes}
      {...listeners}
      ref={setActivatorNodeRef}
      type="button"
      disabled={disabled}
      aria-label={label}
      title={label}
      className="grid size-9 shrink-0 touch-none cursor-grab place-items-center rounded-full border border-current/30 bg-transparent text-current focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-40"
    >
      <GripVertical className="size-4" aria-hidden="true" />
    </button>
  );

  return (
    <article
      ref={setNodeRef}
      className={className}
      style={{ transform: CSS.Transform.toString(transform), transition, position: 'relative', zIndex: isDragging ? 10 : undefined, opacity: isDragging ? 0.75 : 1 }}
    >
      {children(handle)}
    </article>
  );
}