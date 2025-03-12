import { useDraggable } from '@dnd-kit/core';
import { Card } from '../context/CollectionsContext';
import { Box } from '@chakra-ui/react';

export const DraggableCard = ({ card }: { card: Card }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: card.id,
  });

  return (
    <Box
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      padding='10px'
      margin='5px'
      border='1px solid black'
      cursor='grab'
      transform={
        transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined
      }
    >
      {card.title}
    </Box>
  );
};
