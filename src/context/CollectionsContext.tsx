import { createContext, useContext, useEffect, useState } from 'react';
import { generateUUID } from '../utils/uuid';

export type Collection = {
  id: string;
  name: string;
  cards: CardType[];
};

export type CardType = {
  id: string;
  title: string;
  url: string;
  favicon?: string;
};

export type TabType = {
  id: number;
  title: string;
  url: string;
  favIconUrl?: string;
};

type CollectionsContextType = {
  collections: Collection[];
  tabs: TabType[];
  openCollections: string[];
  addCollection: (name: string) => void;
  removeCollection: (collectionName: string) => void;
  saveCollections: (collections: Collection[]) => void;
  removeCard: (cardId: string, collectionId: string) => void;
  saveOpenCollections: (openCollections: string[]) => void;
  exportCollections: () => void;
  importCollections: () => void;
};

const defaultContext = {
  collections: [],
  tabs: [],
  openCollections: [],
  addCollection: () => {},
  removeCollection: () => {},
  saveCollections: () => {},
  removeCard: () => {},
  saveOpenCollections: () => {},
  exportCollections: () => {},
  importCollections: () => {},
};

const CollectionsContext =
  createContext<CollectionsContextType>(defaultContext);

type CollectionsProviderProps = {
  children: React.ReactNode;
};

export const CollectionsProvider: React.FC<CollectionsProviderProps> = ({
  children,
}) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [tabs, setTabs] = useState<TabType[]>([]);

  const [openCollections, setOpenCollections] = useState<string[]>([]);

  useEffect(() => {
    chrome.tabs.query({}, (openTabs) => {
      const formattedTabs = openTabs.map((tab) => ({
        id: tab.id!,
        title: tab.title || 'No Title',
        url: tab.url || 'No URL',
        favIconUrl: tab.favIconUrl || '',
      }));
      setTabs(formattedTabs);
    });
  }, []);

  useEffect(() => {
    chrome.storage.local.get(
      'collections',
      (data: { collections: Collection[] }) => {
        setCollections(data.collections || []);
      }
    );
  }, []);

  useEffect(() => {
    chrome.storage.local.get(
      'openCollections',
      (data: { openCollections: string[] }) => {
        setOpenCollections(data.openCollections || []);
      }
    );
  }, []);

  const addCollection = (name: string) => {
    const id = generateUUID();
    const newCollections = [{ name, id, cards: [] }, ...collections];
    saveCollections(newCollections);
  };

  const removeCollection = (id: string) => {
    const newCollections = collections.filter(
      (collection) => collection.id !== id
    );
    saveCollections(newCollections);
  };

  const removeCard = (cardId: string, collectionId: string) => {
    const newCollections = collections.map((collection) =>
      collection.id === collectionId
        ? {
            ...collection,
            cards: collection.cards.filter((card) => card.id !== cardId),
          }
        : collection
    );
    saveCollections(newCollections);
  };

  const saveCollections = (collections: Collection[]) => {
    setCollections(collections);
    chrome.storage.local.set({ collections });
  };

  const saveOpenCollections = (openCollections: string[]) => {
    setOpenCollections(openCollections);
    chrome.storage.local.set({ openCollections });
  };

  const exportCollections = () => {
    const collectionsAsJson = JSON.stringify(collections);
    const blob = new Blob([collectionsAsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'collections.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importCollectionsFromFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const collections = JSON.parse(e.target?.result as string);
      saveCollections(collections);
    };
    reader.readAsText(file);
  };

  const importCollections = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    // @ts-expect-error fix
    input.addEventListener('change', importCollectionsFromFileUpload);
    input.click();
  };

  const value = {
    collections,
    tabs: tabs.filter((tab) => tab.title !== 'Boby'),
    openCollections,
    addCollection,
    removeCollection,
    saveCollections,
    removeCard,
    saveOpenCollections,
    exportCollections,
    importCollections,
  };

  return (
    <CollectionsContext.Provider value={value}>
      {children}
    </CollectionsContext.Provider>
  );
};

export const useCollections = () => {
  const context = useContext(CollectionsContext);
  if (context === undefined) {
    throw new Error('useCollections must be used within a CollectionsProvider');
  }
  return context;
};
