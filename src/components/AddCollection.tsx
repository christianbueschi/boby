import { Button, CloseButton, Dialog, Input, Portal } from '@chakra-ui/react';
import { useState } from 'react';
import { useCollections } from '../context/CollectionsContext';

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
        <Button variant='ghost'>+ Add Collection</Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>New Collection</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Input
                value={name}
                onInput={(ev: React.FormEvent<HTMLInputElement>) =>
                  setName(ev.currentTarget.value)
                }
                placeholder='Collection Name'
              />
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant='subtle'>Cancel</Button>
              </Dialog.ActionTrigger>
              <Button onClick={handleAddCollection}>Save</Button>
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
