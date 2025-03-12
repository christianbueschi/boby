import { DndContext, DragEndEvent } from '@dnd-kit/core';
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
import { DraggableCard } from './components/DraggableCard';
import { useCollections } from './context/CollectionsContext';
import { AddCollection } from './components/AddCollection';
import { Footer } from './components/Footer';
import { useState } from 'react';

export default function App() {
  const {
    collections,
    tabs,
    saveCollections,
    openCollections,
    saveOpenCollections,
  } = useCollections();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const tabId = active.id;
    const collectionId = over.id;

    const tab = tabs.find((t) => t.id === tabId);

    if (!tab) return;

    const newCollections = collections.map((collection) =>
      collection.id === collectionId
        ? {
            ...collection,
            cards: [
              ...collection.cards,
              {
                id: tab.id,
                title: tab.title,
                url: tab.url,
                favIconUrl: tab.favIconUrl,
              },
            ],
          }
        : collection
    );

    saveCollections(newCollections);

    // Open the accordion if it's not already open
    if (!openCollections.includes(`${collectionId}`)) {
      saveOpenCollections([...openCollections, `${collectionId}`]);
    }

    setDragOverId(null);
  };

  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const handleDragOver = (event: DragEndEvent) => {
    const { over } = event;

    setDragOverId(null);

    if (!over) return;

    setDragOverId(over.id as string);
  };

  return (
    <Box minH='100vh' bg='gray.800'>
      <Grid gridTemplateRows='auto 1fr auto' minHeight='100vh'>
        <GridItem></GridItem>
        <GridItem>
          <DndContext onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
            <HStack gap={4} w='100%' alignItems='initial'>
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

              <VStack flex={1} alignItems='start' bg='gray.900' p={6}>
                <Heading>Open Tabs</Heading>
                <VStack alignItems='start'>
                  {tabs.map((tab) => (
                    <DraggableCard key={tab.title} card={tab} />
                  ))}
                </VStack>
              </VStack>
            </HStack>
          </DndContext>
        </GridItem>
        <GridItem>
          <Footer />
        </GridItem>
      </Grid>
    </Box>
  );
}
