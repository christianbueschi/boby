import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import { DraggableTab } from './components/DraggableTab';
import {
  CardType,
  Collection,
  useCollections,
} from './context/CollectionsContext';
import { AddCollection } from './components/AddCollection';
import { Footer } from './components/Footer';
import { useState } from 'react';
import { generateUUID } from './utils/uuid';
import { Card } from './components/Card';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { DraggableCollection } from './components/DraggableCollection';
import { Accordion } from '@/components/ui/accordion';

export default function App() {
  const {
    collections,
    tabs,
    saveCollections,
    openCollections,
    saveOpenCollections,
  } = useCollections();

  const [activeCard, setActiveCard] = useState<CardType | null>(null);
  const [activeCollection, setActiveCollection] = useState<Collection | null>(
    null
  );
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (!active) return;

    // Check if the dragged item is a card
    const card = collections
      .flatMap((collection) => collection.cards)
      .find((c) => c.id === active.id);

    if (card) {
      setActiveCard(card);
      return;
    }

    // Check if the dragged item is a collection
    const collection = collections.find((c) => c.id === active.id);
    if (collection) {
      setActiveCollection(collection);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (!activeCollection) {
      setDragOverId(`${overId}`);
    }

    let sourceCollectionIndex = -1;
    let targetCollectionIndex = -1;
    let sourceCardIndex = -1;

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
    setActiveCard(null);
    setActiveCollection(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Check if we're reordering collections
    const activeCollectionIndex = collections.findIndex(
      (c) => c.id === activeId
    );
    const overCollectionIndex = collections.findIndex((c) => c.id === overId);

    if (activeCollectionIndex !== -1 && overCollectionIndex !== -1) {
      // We're reordering collections
      const newCollections = arrayMove(
        collections,
        activeCollectionIndex,
        overCollectionIndex
      );

      saveCollections(newCollections);
      return;
    }

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
    <div className="min-h-screen bg-gray-800">
      <div className="grid grid-rows-[auto_1fr_auto] min-h-screen">
        <div></div>
        <div>
          <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
          >
            <div className="flex gap-4 w-full items-start h-full">
              <div className="flex-[5] flex flex-col items-start p-6 gap-8">
                <div className="flex gap-4 p-2 items-center justify-between w-full">
                  <h1 className="text-gray-400 text-lg font-bold">
                    Collections
                  </h1>
                  <AddCollection />
                </div>
                <Accordion
                  type="multiple"
                  value={openCollections}
                  onValueChange={(value) => saveOpenCollections(value)}
                  className="w-full"
                >
                  <SortableContext
                    items={collections.map((c) => c.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {collections.map((collection) => (
                      <DraggableCollection
                        key={collection.id}
                        collection={collection}
                        isDragOver={dragOverId === collection.id}
                      />
                    ))}
                  </SortableContext>
                </Accordion>
              </div>

              <div className="flex-1 flex flex-col items-start bg-gray-900 p-8 gap-8">
                <h2 className="text-gray-400 text-lg font-bold">
                  Open Tabs
                </h2>
                <div className="flex flex-col items-start gap-2">
                  {tabs.map((tab) => (
                    <DraggableTab key={tab.title} tab={tab} />
                  ))}
                </div>
              </div>
            </div>
            <DragOverlay>
              {activeCard ? (
                <Card title={activeCard.title} favicon={activeCard.favicon} />
              ) : activeCollection ? (
                <div className="p-4 bg-gray-700 rounded-md shadow-lg opacity-80 min-w-[200px]">
                  <h3 className="text-lg font-bold text-gray-100">
                    {activeCollection.name}
                  </h3>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
        <div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
