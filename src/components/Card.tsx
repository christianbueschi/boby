import {
  Box,
  Heading,
  HStack,
  IconButton,
  Image,
  VStack,
} from '@chakra-ui/react';
import { PiTrashLight } from 'react-icons/pi';
import {
  Card as CardType,
  useCollections,
} from '../context/CollectionsContext';

type CardProps = {
  card: CardType;
  collectionId?: string;
  small?: boolean;
};

export const Card: React.FC<CardProps> = ({ card, collectionId, small }) => {
  const { removeCard } = useCollections();

  return (
    <Box
      position='relative'
      transform='scale(1)'
      transition='transform 0.3s ease-in-out'
      _hover={{
        transform: 'scale(1.02)',

        '& button': {
          display: 'flex',
        },
      }}
    >
      <a href={card.url} target='_blank' rel='noopener noreferrer'>
        <VStack
          alignItems='initial'
          justifyContent='center'
          h={small ? '40px' : '80px'}
          bg='gray.700'
          p={4}
          borderRadius={small ? 'md' : 'xl'}
        >
          <HStack>
            <Image
              src={card.favIconUrl}
              alt={card.title}
              width={small ? 4 : 8}
              height={small ? 4 : 8}
            />

            <Heading size='sm' lineClamp={small ? 1 : 2}>
              {card.title}
            </Heading>
          </HStack>
        </VStack>
      </a>
      {collectionId && (
        <IconButton
          display='none'
          size='2xs'
          variant='ghost'
          onClick={() => removeCard(card.id, collectionId)}
          position='absolute'
          top={1}
          right={1}
        >
          <PiTrashLight />
        </IconButton>
      )}
    </Box>
  );
};
