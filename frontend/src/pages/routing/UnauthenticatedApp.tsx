import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { CreateQuestion } from '../questions/CreateQuestion';
import Questions from '../questions/Questions';

const UnauthenticatedApp: React.FC = () => {
  return (
    <Routes>
      <Route path="questions/new" element={<CreateQuestion />} />
      <Route path="/" element={<Questions />} />
    </Routes>
  );
};

export default UnauthenticatedApp;
