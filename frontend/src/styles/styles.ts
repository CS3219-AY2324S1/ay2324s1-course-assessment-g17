import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  styles: {
    global: {
      code: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        padding: '0.2rem 0.5rem',
        borderRadius: '4px',
        fontFamily: 'monospace',
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
      ol: {
        marginLeft: '1rem',
      },
      ul: {
        marginLeft: '1rem',
      },
      blockquote: {
        borderLeft: '3px solid #ccc',
        padding: '0.3rem',
        margin: '0.55rem',
        width: 'auto',
      },
    },
  },
});
