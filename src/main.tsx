import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { CollectionsProvider } from './context/CollectionsContext.tsx';
import { ThemeProvider } from 'next-themes';
import { system } from './system/theme.ts';
import { ChakraProvider } from '@chakra-ui/react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider value={system}>
      <ThemeProvider attribute='class' disableTransitionOnChange>
        <CollectionsProvider>
          <App />
        </CollectionsProvider>
      </ThemeProvider>
    </ChakraProvider>
  </StrictMode>
);
