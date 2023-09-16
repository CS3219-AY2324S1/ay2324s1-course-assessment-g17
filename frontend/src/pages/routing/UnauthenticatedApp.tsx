import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginForm from '../auth/LoginForm';

const UnauthenticatedApp: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
    </Routes>
  );
};

export default UnauthenticatedApp;
