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
import { PiTrashLight } from 'react-icons/pi';
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
};

export const DroppableCollection: React.FC<DroppableCollectionProps> = ({
  name,
  id,
  cards,
  isDragOver,
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
        '& > div > .chakra-button': {
          display: 'flex',
        },
      }}
      p={2}
      outline={isDragOver ? '2px solid' : ''}
      outlineColor={isDragOver ? 'purple.500' : ''}
    >
      <HStack justifyContent='space-between' alignItems='center'>
        <Accordion.ItemTrigger w='auto'>
          <Heading color='gray.100'>{name}</Heading>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>

        <IconButton
          size='2xs'
          onClick={() => removeCollection(id)}
          display='none'
          variant='ghost'
        >
          <PiTrashLight />
        </IconButton>
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
