import {
  AbsoluteCenter,
  Accordion,
  Box,
  Heading,
  IconButton,
  SimpleGrid,
  VStack,
} from '@chakra-ui/react';
import { useDroppable } from '@dnd-kit/core';
import {
  Card as CardType,
  useCollections,
} from '../context/CollectionsContext';
import { Card } from './Card';
import { PiTrashLight } from 'react-icons/pi';
import React from 'react';

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
        '& > div > div > .chakra-button': {
          display: 'flex',
        },
      }}
      p={2}
      outline={isDragOver ? '2px solid' : ''}
      outlineColor={isDragOver ? 'purple.500' : ''}
    >
      <Box position='relative'>
        <Accordion.ItemTrigger>
          <Heading color='gray.100'>{name}</Heading>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <AbsoluteCenter axis='vertical' insetEnd='0'>
          <IconButton
            size='2xs'
            onClick={() => removeCollection(id)}
            display='none'
          >
            <PiTrashLight />
          </IconButton>
        </AbsoluteCenter>
      </Box>

      <Accordion.ItemContent overflow='visible'>
        <Accordion.ItemBody>
          {/* <DroppableCollection key={id} id={id} cards={cards} /> */}
          <VStack alignItems='initial' gap={4}>
            <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
              {cards?.map((card) => (
                <Card key={card.id} card={card} collectionId={id} />
              ))}
            </SimpleGrid>
          </VStack>
        </Accordion.ItemBody>
      </Accordion.ItemContent>
    </Accordion.Item>
  );
};
