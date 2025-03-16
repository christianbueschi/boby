import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { Collection } from '../context/CollectionsContext';
import { DroppableCollection } from './DroppableCollection';
import { Box } from '@chakra-ui/react';

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
    <Box
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      position='relative'
      _hover={{
        '& > .drag-handle': {
          opacity: 1,
        },
      }}
    >
      <DroppableCollection
        name={collection.name}
        id={collection.id}
        cards={collection.cards}
        isDragOver={isDragOver}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </Box>
  );
};
