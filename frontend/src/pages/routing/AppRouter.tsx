import { selectIsLoggedIn } from '../../reducers/authSlice';
import { useAppSelector } from '../../reducers/hooks';
import AuthenticatedApp from './AuthenticatedApp';
import UnauthenticatedApp from './UnauthenticatedApp';
import React from 'react';

const AppRouter: React.FC = () => {
  // always return unauthenticated app as there is no authentication set up yet
  // to change this (and handle logic between rendering authenticated
  // and unauthenticated routes once user authentication has been set up)
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  return isLoggedIn ? <AuthenticatedApp /> : <UnauthenticatedApp />;
};

export default AppRouter;
