import { Heading, HStack, Image, VStack } from '@chakra-ui/react';

type CardProps = {
  favicon?: string;
  title: string;
  small?: boolean;
};

export const Card: React.FC<CardProps> = ({ favicon, title, small }) => {
  return (
    <VStack
      alignItems='initial'
      justifyContent='center'
      h={small ? '40px' : '80px'}
      bg='gray.700'
      p={small ? 2 : 4}
      borderRadius='xl'
    >
      <HStack gap={small ? 2 : 4}>
        {favicon && (
          <Image
            src={favicon}
            alt={title}
            width={small ? 4 : 6}
            height={small ? 4 : 6}
          />
        )}

        <Heading size='sm' lineClamp={small ? 1 : 2}>
          {title}
        </Heading>
      </HStack>
    </VStack>
  );
};
