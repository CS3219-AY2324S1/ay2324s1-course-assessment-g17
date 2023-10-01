import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { CreateQuestion } from '../questions/CreateQuestion';
import Questions from '../questions/Questions';
import { UpdateQuestion } from '../questions/UpdateQuestion';
import ViewQuestion from '../questions/ViewQuestion';
import PageNotFound from './NotFound';
import Matching from '../matching/Matching';
import ProtectedRoute from './ProtectedRoute';
import { useUser } from '../../context/UserContext';

const AuthenticatedApp: React.FC = () => {
  const { user } = useUser();
  return (
    <Routes>
      {/* Question routes */}
      <Route path="/" element={<Questions />} />
      <Route path="/questions/new" element={<ProtectedRoute child={<CreateQuestion />} />} />
      <Route path="/question/:questionId" element={<ViewQuestion />} />
      <Route path="/question/:questionId/edit" element={<ProtectedRoute child={<UpdateQuestion />} />} />

      {/* Matching routes */}
      <Route path="/matching" element={<Matching />} />

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default AuthenticatedApp;
