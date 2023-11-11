import React from 'react';
import { useSelector } from 'react-redux';
import { selectIsAdmin } from '../../reducers/authSlice';
import PageNotAuthorized from './NotAuthorized';

interface ProtectedRouteProps {
  child: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ child }) => {
  const isAdmin = useSelector(selectIsAdmin);
  return isAdmin ? child : <PageNotAuthorized />;
};

export default ProtectedRoute;
