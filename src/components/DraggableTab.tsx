import { useDraggable } from '@dnd-kit/core';
import { TabType } from '../context/CollectionsContext';
import { Box } from '@chakra-ui/react';
import { Card } from './Card';

export const DraggableTab = ({ tab }: { tab: TabType }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: tab.id,
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
      <Box
        position='relative'
        transform='scale(1)'
        transition='transform 0.3s ease-in-out'
        _hover={{
          transform: 'scale(1.02)',

          '& button': {
            display: 'flex',
          },
        }}
      >
        <Box>
          <Card favicon={tab.favIconUrl} title={tab.title} small />
        </Box>
      </Box>
    </Box>
  );
};
