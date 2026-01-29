import { CSS } from '@dnd-kit/utilities';
import { CardType, useCollections } from '../context/CollectionsContext';
import {
  PiArrowsOutCardinal,
  PiNotePencilLight,
  PiTrashLight,
} from 'react-icons/pi';
import { Card } from './Card';
import { useSortable } from '@dnd-kit/sortable';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';

type DraggableCardProps = {
  card: CardType;
  collectionId: string;
};

export const DraggableCard: React.FC<DraggableCardProps> = ({
  card,
  collectionId,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: card.id });

  const { removeCard, saveCollections, collections } = useCollections();

  const [editCartTitle, setEditCartTitle] = useState<string>('');
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleSave = () => {
    const foundCollection = collections.find((c) => c.id === collectionId);
    if (!foundCollection || !editCartTitle) return;

    const newCards = foundCollection.cards.map((c) =>
      c.id === card.id ? { ...c, title: editCartTitle } : c
    );

    const newCollection = collections.map((collection) => {
      if (collection.id === collectionId) {
        return { ...collection, cards: newCards };
      } else {
        return collection;
      }
    });

    saveCollections(newCollection);
    setEditCartTitle('');
    setIsEditOpen(false);
  };

  const handleOpenEdit = () => {
    setEditCartTitle(card.title);
    setIsEditOpen(true);
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: 'grab',
      }}
    >
      <div className="relative group transition-transform duration-300 ease-in-out hover:scale-[1.02]">
        <a href={card.url} target="_blank" rel="noopener noreferrer">
          <Card favicon={card.favicon} title={card.title} />
        </a>
        {collectionId && (
          <div className="absolute top-1 right-1 hidden group-hover:flex gap-1">
            <Button
              size="icon-xs"
              variant="ghost"
              onClick={() => removeCard(card.id, collectionId)}
            >
              <PiTrashLight />
            </Button>
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button size="icon-xs" variant="ghost" onClick={handleOpenEdit}>
                  <PiNotePencilLight />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Card</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <Label htmlFor="title">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    value={editCartTitle}
                    onChange={(ev) => setEditCartTitle(ev.target.value)}
                    className="mt-2"
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleSave}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              size="icon-xs"
              variant="ghost"
              className="cursor-grab"
              {...listeners}
              {...attributes}
            >
              <PiArrowsOutCardinal />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
