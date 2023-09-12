import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { CreateQuestion } from '../questions/CreateQuestion';
import Questions from '../questions/Questions';
import { UpdateQuestion } from '../questions/UpdateQuestion';

const UnauthenticatedApp: React.FC = () => {
  return (
    <Routes>
      <Route path="questions/new" element={<CreateQuestion />} />
      <Route path="/" element={<Questions />} />
      <Route path="questions/:questionId/edit" element={<UpdateQuestion />} />
    </Routes>
  );
};

export default UnauthenticatedApp;
