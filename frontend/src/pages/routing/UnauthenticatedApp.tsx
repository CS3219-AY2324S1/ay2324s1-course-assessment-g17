import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { CreateQuestion } from '../questions/CreateQuestion';
import Questions from '../questions/Questions';
import { UpdateQuestion } from '../questions/UpdateQuestion';
import ViewQuestion from '../questions/ViewQuestion';

const UnauthenticatedApp: React.FC = () => {
  return (
    <Routes>
      <Route path="questions/new" element={<CreateQuestion />} />
      <Route path="/" element={<Questions />} />
      <Route path="question/:questionId/edit" element={<UpdateQuestion />} />
      <Route path="/question/:questionId" element={<ViewQuestion />} />
    </Routes>
  );
};

export default UnauthenticatedApp;
