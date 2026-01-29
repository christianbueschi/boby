import { useState } from 'react';
import { useCollections } from '../context/CollectionsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">+ Add Collection</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Collection</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            placeholder="Collection Name"
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleAddCollection}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
