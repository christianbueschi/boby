import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { Collection } from '../context/CollectionsContext';
import { DroppableCollection } from './DroppableCollection';

type DraggableCollectionProps = {
  collection: Collection;
  isDragOver: boolean;
};

export const DraggableCollection: React.FC<DraggableCollectionProps> = ({
  collection,
  isDragOver,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: collection.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className="relative group"
    >
      <DroppableCollection
        name={collection.name}
        id={collection.id}
        cards={collection.cards}
        isDragOver={isDragOver}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
};
