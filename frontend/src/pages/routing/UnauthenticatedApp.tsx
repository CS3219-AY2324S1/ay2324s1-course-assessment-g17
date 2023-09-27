import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginForm from '../auth/LoginForm';
import SignUpForm from '../auth/SignUpForm';

const UnauthenticatedApp: React.FC = () => {
  return (
    <Routes>
      <Route path="/signup" element={<SignUpForm />} />
      <Route path="*" element={<LoginForm />} />
    </Routes>
  );
};

export default UnauthenticatedApp;
