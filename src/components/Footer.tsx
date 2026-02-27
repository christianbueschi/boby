import { Button, HStack, Image, Text } from '@chakra-ui/react';
import { useCollections } from '../context/CollectionsContext';
import { PiExportLight } from 'react-icons/pi';
import { t } from '../i18n/t';

export const Footer: React.FC = () => {
  const { exportCollections, importCollections } = useCollections();

  return (
    <HStack bg='gray.900' w='100%' gap={12} p={4}>
      <HStack gap={2}>
        <Image
          src='/favicon.png'
          alt={t('footer.logoAlt')}
          width={8}
          height={8}
          borderRadius='md'
        />
        <Text>{t('footer.brand')}</Text>
      </HStack>

      <HStack gap={2}>
        <Button onClick={exportCollections} size='xs' variant='ghost'>
          <PiExportLight />
          {t('footer.export')}
        </Button>
        <Button onClick={importCollections} size='xs' variant='ghost'>
          {t('footer.import')}
        </Button>
      </HStack>
    </HStack>
  );
};
