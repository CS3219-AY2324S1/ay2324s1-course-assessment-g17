import { selectIsLoggedIn } from '../../reducers/authSlice';
import { useAppSelector } from '../../reducers/hooks';
import AuthenticatedApp from './AuthenticatedApp';
import UnauthenticatedApp from './UnauthenticatedApp';
import React from 'react';

const AppRouter: React.FC = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  return isLoggedIn ? <AuthenticatedApp /> : <UnauthenticatedApp />;
};

export default AppRouter;
