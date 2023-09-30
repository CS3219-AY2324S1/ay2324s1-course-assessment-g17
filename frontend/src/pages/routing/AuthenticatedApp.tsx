import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { CreateQuestion } from '../questions/CreateQuestion';
import Questions from '../questions/Questions';
import { UpdateQuestion } from '../questions/UpdateQuestion';
import ViewQuestion from '../questions/ViewQuestion';
import PageNotFound from './NotFound';
import ProtectedRoute from './ProtectedRoute';

const AuthenticatedApp: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Questions />} />
      <Route path="/questions/new" element={<ProtectedRoute child={<CreateQuestion />} />} />
      <Route path="/question/:questionId" element={<ViewQuestion />} />
      <Route path="/question/:questionId/edit" element={<ProtectedRoute child={<UpdateQuestion />} />} />

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default AuthenticatedApp;
