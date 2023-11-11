import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { CreateQuestion } from '../questions/CreateQuestion';
import Questions from '../questions/Questions';
import { UpdateQuestion } from '../questions/UpdateQuestion';
import ViewQuestion from '../questions/ViewQuestion';
import PageNotFound from './NotFound';

const AuthenticatedApp: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Questions />} />
      <Route path="questions/new" element={<CreateQuestion />} />
      <Route path="question/:questionId/edit" element={<UpdateQuestion />} />
      <Route path="/question/:questionId" element={<ViewQuestion />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default AuthenticatedApp;
