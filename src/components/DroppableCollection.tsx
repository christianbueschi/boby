import { useDroppable } from '@dnd-kit/core';
import { CardType, useCollections } from '../context/CollectionsContext';
import { PiTrashLight, PiArrowsOutCardinal } from 'react-icons/pi';
import React from 'react';
import { DraggableCard } from './DraggableCard';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
    <AccordionItem
      value={id}
      ref={setNodeRef}
      className={cn(
        'p-2 group/collection border-gray-700',
        isDragOver && 'outline outline-2 outline-purple-500'
      )}
    >
      <div className="flex justify-between items-center">
        <AccordionTrigger className="w-auto hover:no-underline">
          <h3 className="text-gray-100 font-bold">{name}</h3>
        </AccordionTrigger>

        <div className="hidden group-hover/collection:flex gap-1">
          <Button
            size="icon-xs"
            onClick={() => removeCollection(id)}
            variant="ghost"
            aria-label="Remove collection"
          >
            <PiTrashLight />
          </Button>
          {dragHandleProps && (
            <Button
              size="icon-xs"
              variant="ghost"
              className="cursor-grab"
              aria-label="Drag collection"
              {...dragHandleProps}
            >
              <PiArrowsOutCardinal />
            </Button>
          )}
        </div>
      </div>

      <AccordionContent className="overflow-visible">
        <div className="flex flex-col items-start gap-4">
          <SortableContext
            items={cards.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
              {cards?.map((card) => (
                <DraggableCard key={card.id} card={card} collectionId={id} />
              ))}
            </div>
          </SortableContext>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
