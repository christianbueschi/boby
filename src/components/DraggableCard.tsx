import { useDraggable } from '@dnd-kit/core';
import { Card as CardType } from '../context/CollectionsContext';
import { Box } from '@chakra-ui/react';
import { Card } from './Card';

export const DraggableCard = ({ card }: { card: CardType }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: card.id,
  });

  return (
    <Box
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      cursor='grab'
      transform={
        transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined
      }
    >
      <Card card={card} small />
    </Box>
  );
};
