import AuthAPI from '../../api/users/auth';
import { selectIsLoggedIn, setUser } from '../../reducers/authSlice';
import { useAppDispatch, useAppSelector } from '../../reducers/hooks';
import AuthenticatedApp from './AuthenticatedApp';
import UnauthenticatedApp from './UnauthenticatedApp';
import React from 'react';

const AppRouter: React.FC = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const dispatch = useAppDispatch();

  if (!isLoggedIn) {
    new AuthAPI()
      .getCurrentUser()
      .then((user) => dispatch(setUser(user)))
      .catch((err) => {
        // Possibly due to no token (not logged in yet)
        console.error(err);
      });
  }
  return isLoggedIn ? <AuthenticatedApp /> : <UnauthenticatedApp />;
};

export default AppRouter;
