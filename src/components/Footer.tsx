import {
  Button,
  HStack,
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from '@chakra-ui/react';
import { HiCog } from 'react-icons/hi';
import { useCollections } from '../context/CollectionsContext';

export const Footer: React.FC = () => {
  const { exportCollections, importCollections } = useCollections();

  return (
    <HStack bg='gray.800' w='100%'>
      <MenuRoot positioning={{ placement: 'top-end' }}>
        <MenuTrigger asChild>
          <Button variant='outline' size='sm'>
            <HiCog />
          </Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem value='export' onClick={exportCollections}>
            Export Collections
          </MenuItem>
          <MenuItem value='export' onClick={importCollections}>
            Import Collections
          </MenuItem>
        </MenuContent>
      </MenuRoot>
    </HStack>
  );
};
