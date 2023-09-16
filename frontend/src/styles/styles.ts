import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  styles: {
    global: {
      code: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        padding: '0.2rem 0.5rem',
        borderRadius: '4px',
        fontFamily: 'monospace',
      },
      '.ql-align-center': {
        textAlign: 'center',
      },

      '.ql-align-right': {
        textAlign: 'right',
      },
      h1: {
        fontSize: 'xl',
        fontWeight: 'bold',
      },
      h2: {
        fontSize: 'lg',
        fontWeight: 'bold',
      },
      h3: {
        fontSize: 'md',
      },
    },
  },
});
