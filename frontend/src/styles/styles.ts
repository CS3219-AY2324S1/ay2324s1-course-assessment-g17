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
      ol: {
        marginLeft: '1rem',
      },
      ul: {
        marginLeft: '1rem',
      },
      blockquote: {
        backgroundColor: '#f8f8f8',
        borderLeft: '4px solid #ccc',
        padding: '1rem',
        margin: '1rem 0',
      },
    },
  },
});
