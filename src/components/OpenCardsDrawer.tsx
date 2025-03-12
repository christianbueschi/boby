import { VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { DraggableCard } from './DraggableCard';
import { Card } from '../context/CollectionsContext';

export const OpenCardsDrawer: React.FC = () => {
  const [tabs, setTabs] = useState<Card[]>([]);

  useEffect(() => {
    chrome.tabs.query({}, (openCards) => {
      const formattedTabs = openCards.map((card) => ({
        id: card.id!,
        title: card.title || 'No Title',
        url: card.url || 'No URL',
      }));
      setTabs(formattedTabs);
    });
  }, []);

  return (
    <VStack>
      {tabs.map((tab) => (
        <DraggableCard key={tab.title} card={tab} />
      ))}
    </VStack>
  );
};
