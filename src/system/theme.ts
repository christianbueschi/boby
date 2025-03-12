import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';
import '@fontsource/inter/400.css'; // Regular
import '@fontsource/inter/700.css'; // Bold (or other weights)
import { colors } from './colors';

const config = defineConfig({
  globalCss: {
    'html, body': {
      height: '100vh',
      width: '100%',
    },
    body: {
      color: 'gray.100',
    },
    heading: {
      fontFamily: 'heading',
      fontWeight: 'bold',
      color: 'gray.100',
    },
  },
  theme: {
    tokens: {
      fonts: {
        heading: { value: 'Inter, sans-serif' },
        body: { value: 'Inter, sans-serif' },
      },
      colors,
    },
  },
});

export const system = createSystem(defaultConfig, config);
