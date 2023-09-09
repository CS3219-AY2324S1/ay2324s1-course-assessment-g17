import React from 'react';
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './pages/routing/AppRouter';

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
