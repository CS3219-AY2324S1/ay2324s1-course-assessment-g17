import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './pages/routing/AppRouter';
import Navbar from './components/navigation/Navbar';
import { theme } from './styles/styles';
import { Provider } from 'react-redux';
import { store } from './reducers/store';

const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Provider store={store}>
          <Navbar />
          <AppRouter />
        </Provider>
      </BrowserRouter>
    </ChakraProvider>
  );
};

export default App;
