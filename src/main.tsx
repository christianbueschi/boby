import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { CollectionsProvider } from './context/CollectionsContext.tsx';
import { ThemeProvider } from 'next-themes';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider attribute='class' disableTransitionOnChange>
      <CollectionsProvider>
        <App />
      </CollectionsProvider>
    </ThemeProvider>
  </StrictMode>
);
