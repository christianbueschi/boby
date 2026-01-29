import { CSS } from '@dnd-kit/utilities';
import { CardType, useCollections } from '../context/CollectionsContext';
import {
  Box,
  Button,
  CloseButton,
  Dialog,
  Field,
  HStack,
  IconButton,
  Input,
  Portal,
} from '@chakra-ui/react';
import {
  PiArrowsOutCardinal,
  PiNotePencilLight,
  PiTrashLight,
} from 'react-icons/pi';
import { Card } from './Card';
import { useSortable } from '@dnd-kit/sortable';
import { useState } from 'react';

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

  const [editCartTitle, setEditCartTitle] = useState<string>();

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
  };

  return (
    <Box
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: 'grab',
      }}
    >
      <Box
        position='relative'
        transform='scale(1)'
        transition='transform 0.3s ease-in-out'
        _hover={{
          transform: 'scale(1.02)',

          '& div': {
            display: 'flex',
          },
        }}
      >
        <a href={card.url} target='_blank'>
          <Card favicon={card.favicon} title={card.title} />
        </a>
        {collectionId && (
          <HStack position='absolute' top={1} right={1} display='none'>
            <IconButton
              size='2xs'
              variant='ghost'
              onClick={() => removeCard(card.id, collectionId)}
            >
              <PiTrashLight />
            </IconButton>
            <Dialog.Root
              size='md'
              onOpenChange={(details) =>
                setEditCartTitle(details.open ? card.title : undefined)
              }
              open={!!editCartTitle}
            >
              <Dialog.Trigger asChild>
                <IconButton size='2xs' variant='ghost'>
                  <PiNotePencilLight />
                </IconButton>
              </Dialog.Trigger>
              <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                  <Dialog.Content>
                    <Dialog.Header>
                      <Dialog.Title>Edit Card</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                      <Field.Root>
                        <Field.Label>
                          Title
                          <Field.RequiredIndicator />
                        </Field.Label>
                        <Input
                          type='text'
                          value={editCartTitle}
                          onInput={(ev) =>
                            setEditCartTitle(ev.currentTarget.value)
                          }
                          onKeyDown={(ev) => {
                            if (ev.key === 'Enter') handleSave();
                          }}
                        />
                      </Field.Root>
                    </Dialog.Body>
                    <Dialog.Footer>
                      <Dialog.ActionTrigger asChild>
                        <Button variant='outline'>Cancel</Button>
                      </Dialog.ActionTrigger>
                      <Button onClick={handleSave}>Save</Button>
                    </Dialog.Footer>
                    <Dialog.CloseTrigger asChild>
                      <CloseButton size='sm' />
                    </Dialog.CloseTrigger>
                  </Dialog.Content>
                </Dialog.Positioner>
              </Portal>
            </Dialog.Root>

            <IconButton
              cursor='grab'
              {...listeners}
              {...attributes}
              size='2xs'
              variant='ghost'
            >
              <PiArrowsOutCardinal />
            </IconButton>
          </HStack>
        )}
      </Box>
    </Box>
  );
};
