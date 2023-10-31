import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import LoginForm from '../auth/LoginForm';
import SignUpForm from '../auth/SignUpForm';
import ForgotPassword from '../auth/ForgotPassword';

const UnauthenticatedApp: React.FC = () => {
  return (
    <Routes>
      <Route path="/signup" element={<SignUpForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default UnauthenticatedApp;
