import {
  Accordion,
  Heading,
  HStack,
  IconButton,
  SimpleGrid,
  VStack,
} from '@chakra-ui/react';
import { useDroppable } from '@dnd-kit/core';
import { CardType, useCollections } from '../context/CollectionsContext';
import { PiTrashLight, PiArrowsOutCardinal } from 'react-icons/pi';
import React from 'react';
import { DraggableCard } from './DraggableCard';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

type DroppableCollectionProps = {
  name: string;
  id: string;
  cards: CardType[];
  isDragOver: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
};

export const DroppableCollection: React.FC<DroppableCollectionProps> = ({
  name,
  id,
  cards,
  isDragOver,
  dragHandleProps,
}) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  const { removeCollection } = useCollections();

  return (
    <Accordion.Item
      value={id}
      ref={setNodeRef}
      _hover={{
        '& .edit-buttons': {
          display: 'flex',
        },
      }}
      p={2}
      outline={isDragOver ? '2px solid' : ''}
      outlineColor={isDragOver ? 'purple.500' : ''}
    >
      <HStack justifyContent='space-between' alignItems='center'>
        <Accordion.ItemTrigger w='auto' cursor='pointer'>
          <Heading color='gray.100'>{name}</Heading>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>

        <HStack display='none' className='edit-buttons'>
          <IconButton
            size='2xs'
            onClick={() => removeCollection(id)}
            variant='ghost'
            aria-label='Remove collection'
          >
            <PiTrashLight />
          </IconButton>
          {dragHandleProps && (
            <IconButton
              size='2xs'
              variant='ghost'
              cursor='grab'
              aria-label='Drag collection'
              {...dragHandleProps}
            >
              <PiArrowsOutCardinal />
            </IconButton>
          )}
        </HStack>
      </HStack>

      <Accordion.ItemContent overflow='visible'>
        <Accordion.ItemBody>
          <VStack alignItems='initial' gap={4}>
            <SortableContext
              items={cards.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
                {cards?.map((card) => (
                  <DraggableCard key={card.id} card={card} collectionId={id} />
                ))}
              </SimpleGrid>
            </SortableContext>
          </VStack>
        </Accordion.ItemBody>
      </Accordion.ItemContent>
    </Accordion.Item>
  );
};
