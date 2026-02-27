import {
  Accordion,
  Button,
  CloseButton,
  Dialog,
  Field,
  Heading,
  HStack,
  IconButton,
  Input,
  Portal,
  SimpleGrid,
  VStack,
} from '@chakra-ui/react';
import { useDroppable } from '@dnd-kit/core';
import { CardType, useCollections } from '../context/CollectionsContext';
import {
  PiTrashLight,
  PiArrowsOutCardinal,
  PiNotePencilLight,
} from 'react-icons/pi';
import React, { useState } from 'react';
import { DraggableCard } from './DraggableCard';
import { t } from '../i18n/t';
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

  const { removeCollection, saveCollections, collections } = useCollections();

  const [editCollectionName, setEditCollectionName] = useState<string>();

  const handleSave = () => {
    if (!editCollectionName) return;

    const newCollections = collections.map((collection) =>
      collection.id === id
        ? { ...collection, name: editCollectionName }
        : collection
    );

    saveCollections(newCollections);
    setEditCollectionName('');
  };

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
            aria-label={t('editCollection.removeAriaLabel')}
          >
            <PiTrashLight />
          </IconButton>
          <Dialog.Root
            size='md'
            onOpenChange={(details) =>
              setEditCollectionName(details.open ? name : undefined)
            }
            open={!!editCollectionName}
          >
            <Dialog.Trigger asChild>
              <IconButton
                size='2xs'
                variant='ghost'
                aria-label={t('editCollection.editAriaLabel')}
              >
                <PiNotePencilLight />
              </IconButton>
            </Dialog.Trigger>
            <Portal>
              <Dialog.Backdrop />
              <Dialog.Positioner>
                <Dialog.Content>
                  <Dialog.Header>
                    <Dialog.Title>{t('editCollection.title')}</Dialog.Title>
                  </Dialog.Header>
                  <Dialog.Body>
                    <Field.Root>
                      <Field.Label>
                        {t('editCollection.nameLabel')}
                        <Field.RequiredIndicator />
                      </Field.Label>
                      <Input
                        type='text'
                        value={editCollectionName}
                        onInput={(ev) =>
                          setEditCollectionName(ev.currentTarget.value)
                        }
                        onKeyDown={(ev) => {
                          if (ev.key === 'Enter') handleSave();
                        }}
                      />
                    </Field.Root>
                  </Dialog.Body>
                  <Dialog.Footer>
                    <Dialog.ActionTrigger asChild>
                      <Button variant='outline'>{t('common.cancel')}</Button>
                    </Dialog.ActionTrigger>
                    <Button onClick={handleSave}>{t('common.save')}</Button>
                  </Dialog.Footer>
                  <Dialog.CloseTrigger asChild>
                    <CloseButton size='sm' />
                  </Dialog.CloseTrigger>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>
          {dragHandleProps && (
            <IconButton
              size='2xs'
              variant='ghost'
              cursor='grab'
              aria-label={t('editCollection.dragAriaLabel')}
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
