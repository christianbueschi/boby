import { useDraggable } from '@dnd-kit/core';
import { TabType } from '../context/CollectionsContext';
import { Card } from './Card';

export const DraggableTab = ({ tab }: { tab: TabType }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: tab.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="cursor-grab"
      style={{
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
      }}
    >
      <div className="relative transition-transform duration-300 ease-in-out hover:scale-[1.02]">
        <div>
          <Card favicon={tab.favIconUrl} title={tab.title} small />
        </div>
      </div>
    </div>
  );
};
