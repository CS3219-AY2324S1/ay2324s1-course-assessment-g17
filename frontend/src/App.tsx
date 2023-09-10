import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './pages/routing/AppRouter';
import Navbar from './components/navigation/Navbar';

const App: React.FC = () => {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Navbar />
        <AppRouter />
      </BrowserRouter>
    </ChakraProvider>
  );
};

export default App;
