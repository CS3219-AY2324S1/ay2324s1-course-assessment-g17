import { Center, Spinner } from '@chakra-ui/react';
import AuthAPI from '../../api/users/auth';
import { selectIsLoggedIn, setUser } from '../../reducers/authSlice';
import { useAppDispatch, useAppSelector } from '../../reducers/hooks';
import AuthenticatedApp from './AuthenticatedApp';
import UnauthenticatedApp from './UnauthenticatedApp';
import React, { useState } from 'react';

const AppRouter: React.FC = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const dispatch = useAppDispatch();
  const authApi = new AuthAPI();
  const [loading, setLoading] = useState(true);
  
  if (!isLoggedIn) {
    authApi
      .getCurrentUser()
      .then((user) => {
        dispatch(setUser(user));
        setLoading(false);
      })
      .catch((err) => {
        // Possibly due to no token (not logged in yet)
        console.log(err);
        authApi
          .useRefreshToken()
          .then(async () => await authApi.getCurrentUser())
          .then((user) => dispatch(setUser(user)))
          .catch(() => 'User is currently unauthenticated')
          .finally(() => {
            setLoading(false);
          });
      });
  }
  
  return loading ? (
    <Center h="100vh">
      <Spinner size="xl" />
    </Center>
  ) : isLoggedIn ? (
    <AuthenticatedApp />
  ) : (
    <UnauthenticatedApp />
  );
};

export default AppRouter;
