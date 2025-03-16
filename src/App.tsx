import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  Accordion,
  Box,
  Grid,
  GridItem,
  Heading,
  HStack,
  VStack,
} from '@chakra-ui/react';
import { DroppableCollection } from './components/DroppableCollection';
import { DraggableTab } from './components/DraggableTab';
import { CardType, useCollections } from './context/CollectionsContext';
import { AddCollection } from './components/AddCollection';
import { Footer } from './components/Footer';
import { useState } from 'react';
import { generateUUID } from './utils/uuid';
import { Card } from './components/Card';
import { arrayMove } from '@dnd-kit/sortable';

export default function App() {
  const {
    collections,
    tabs,
    saveCollections,
    openCollections,
    saveOpenCollections,
  } = useCollections();

  const [activeCard, setActiveCard] = useState<CardType | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (!active) return;

    const card = collections
      .flatMap((collection) => collection.cards)
      .find((c) => c.id === active.id);

    if (card) {
      setActiveCard(card);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    setDragOverId(`${overId}`);

    let sourceCollectionIndex = -1;
    let targetCollectionIndex = -1;
    let sourceCardIndex = -1;
    // let targetCardIndex = -1;

    collections.forEach((collection, colIndex) => {
      const activeCardIndex = collection.cards.findIndex(
        (c) => c.id === activeId
      );
      const overCardIndex = collection.cards.findIndex((c) => c.id === overId);
      if (activeCardIndex !== -1) {
        sourceCollectionIndex = colIndex;
        sourceCardIndex = activeCardIndex;
      }
      if (overCardIndex !== -1) {
        targetCollectionIndex = colIndex;
      }
    });

    if (sourceCollectionIndex === -1 || sourceCardIndex === -1) return;

    const sourceCollection = collections[sourceCollectionIndex];
    const movedCard = sourceCollection.cards[sourceCardIndex];

    if (targetCollectionIndex === -1) return;

    const targetCollection = collections[targetCollectionIndex];

    // Check if moving **within the same collection**
    if (sourceCollectionIndex === targetCollectionIndex) {
      const activeIndex = sourceCollection.cards.findIndex(
        (c) => c.id === activeId
      );

      const overIndex = sourceCollection.cards.findIndex(
        (c) => c.id === overId
      );

      if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex)
        return;

      // Use `arrayMove` to reorder items inside the same collection
      const updatedCards = arrayMove(
        sourceCollection.cards,
        activeIndex,
        overIndex
      );

      const newCollections = [...collections];
      newCollections[sourceCollectionIndex] = {
        ...sourceCollection,
        cards: updatedCards,
      };

      saveCollections(newCollections);
    } else {
      // Moving to a new collection
      const updatedSourceCards = sourceCollection.cards.filter(
        (c) => c.id !== activeId
      );
      const updatedTargetCards = [...targetCollection.cards, movedCard];

      const newCollections = [...collections];
      newCollections[sourceCollectionIndex] = {
        ...sourceCollection,
        cards: updatedSourceCards,
      };
      newCollections[targetCollectionIndex] = {
        ...targetCollection,
        cards: updatedTargetCards,
      };

      saveCollections(newCollections);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setDragOverId(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // add new tab/card to collection
    const tab = tabs.find((t) => t.id === activeId);

    if (tab) {
      const newCollections = collections.map((collection) =>
        collection.id === overId
          ? {
              ...collection,
              cards: [
                ...collection.cards,
                {
                  id: generateUUID(),
                  title: tab.title,
                  url: tab.url,
                  favicon: tab.favIconUrl,
                },
              ],
            }
          : collection
      );

      saveCollections(newCollections);

      // Open the accordion if it's not already open
      if (!openCollections.includes(`${overId}`)) {
        saveOpenCollections([...openCollections, `${overId}`]);
      }

      setDragOverId(null);
      setActiveCard(null);
    } else {
      let sourceCollectionIndex = -1;
      let sourceCardIndex = -1;

      collections.forEach((collection, colIndex) => {
        const cardIndex = collection.cards.findIndex((c) => c.id === activeId);
        if (cardIndex !== -1) {
          sourceCollectionIndex = colIndex;
          sourceCardIndex = cardIndex;
        }
      });

      if (sourceCollectionIndex === -1 || sourceCardIndex === -1) return;

      const sourceCollection = collections[sourceCollectionIndex];
      const movedCard = sourceCollection.cards[sourceCardIndex];

      const targetCollectionIndex = collections.findIndex(
        (c) => c.id === overId
      );

      if (targetCollectionIndex === -1) return;

      const targetCollection = collections[targetCollectionIndex];

      // If dropping in the same collection, sorting has already been handled
      if (sourceCollectionIndex === targetCollectionIndex) return;

      // Remove from source collection and add to target collection
      const updatedSourceCards = sourceCollection.cards.filter(
        (c) => c.id !== activeId
      );
      const updatedTargetCards = [...targetCollection.cards, movedCard];

      const newCollections = [...collections];
      newCollections[sourceCollectionIndex] = {
        ...sourceCollection,
        cards: updatedSourceCards,
      };
      newCollections[targetCollectionIndex] = {
        ...targetCollection,
        cards: updatedTargetCards,
      };

      saveCollections(newCollections);
    }
  };

  return (
    <Box minH='100vh' bg='gray.800'>
      <Grid gridTemplateRows='auto 1fr auto' minHeight='100vh'>
        <GridItem></GridItem>
        <GridItem>
          <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
          >
            <HStack gap={4} w='100%' alignItems='initial' h='100%'>
              <VStack flex={5} alignItems='initial' p={6} gap={8}>
                <HStack
                  gap={4}
                  p={2}
                  alignItems='center'
                  justifyContent='space-between'
                >
                  <Heading as='h1' color='gray.400' size='md'>
                    Collections
                  </Heading>
                  <AddCollection />
                </HStack>
                <Accordion.Root
                  collapsible
                  value={openCollections}
                  onValueChange={(e) => saveOpenCollections(e.value)}
                  multiple
                >
                  {collections.map(({ name, id, cards }) => (
                    <DroppableCollection
                      name={name}
                      key={id}
                      id={id}
                      cards={cards}
                      isDragOver={dragOverId === id}
                    />
                  ))}
                </Accordion.Root>
              </VStack>

              <VStack flex={1} alignItems='start' bg='gray.900' p={8} gap={8}>
                <Heading color='gray.400' size='md'>
                  Open Tabs
                </Heading>
                <VStack alignItems='start'>
                  {tabs.map((tab) => (
                    <DraggableTab key={tab.title} tab={tab} />
                  ))}
                </VStack>
              </VStack>
            </HStack>
            <DragOverlay>
              {activeCard ? (
                <Card title={activeCard.title} favicon={activeCard.favicon} />
              ) : null}
            </DragOverlay>
          </DndContext>
        </GridItem>
        <GridItem>
          <Footer />
        </GridItem>
      </Grid>
    </Box>
  );
}
