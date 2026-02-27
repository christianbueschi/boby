import { Button, CloseButton, Dialog, Input, Portal } from '@chakra-ui/react';
import { useState } from 'react';
import { useCollections } from '../context/CollectionsContext';
import { t } from '../i18n/t';

export const AddCollection: React.FC = () => {
  const { addCollection } = useCollections();

  const [name, setName] = useState('');

  const [open, setOpen] = useState(false);

  const handleAddCollection = () => {
    if (name) {
      addCollection(name);
      setName('');
      setOpen(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={() => setOpen(!open)}>
      <Dialog.Trigger asChild>
        <Button variant='ghost'>{t('addCollection.trigger')}</Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{t('addCollection.title')}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Input
                value={name}
                onInput={(ev: React.FormEvent<HTMLInputElement>) =>
                  setName(ev.currentTarget.value)
                }
                onKeyDown={(ev) => {
                  if (ev.key === 'Enter') handleAddCollection();
                }}
                placeholder={t('addCollection.namePlaceholder')}
              />
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant='subtle'>{t('common.cancel')}</Button>
              </Dialog.ActionTrigger>
              <Button onClick={handleAddCollection}>{t('common.save')}</Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size='sm' />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
