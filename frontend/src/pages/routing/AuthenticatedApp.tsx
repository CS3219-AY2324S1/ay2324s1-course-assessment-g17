import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { CreateQuestion } from '../questions/CreateQuestion';
import { UpdateQuestion } from '../questions/UpdateQuestion';
import ViewQuestion from '../questions/ViewQuestion';
import ViewProfile from '../users/ViewProfile';
import PageNotFound from './NotFound';
import Home from '../home/Home';
import CollaborationRoom from '../collaboration/CollaborationRoom';
import Matching from '../matching/Matching';
import ProtectedRoute from './ProtectedRoute';
import { SocketProvider } from '../../context/socket';

const AuthenticatedApp: React.FC = () => {
  return (
    <Routes>
      {/* Question routes */}
      <Route path="/" element={<Home />} />
      <Route path="/questions/new" element={<ProtectedRoute child={<CreateQuestion />} />} />
      <Route path="question/:questionId/edit" element={<UpdateQuestion />} />
      <Route path="/question/:questionId" element={<ViewQuestion />} />
      <Route path="/question/:questionId/edit" element={<ProtectedRoute child={<UpdateQuestion />} />} />
      {/* User routes */}
      <Route path="/profile" element={<ViewProfile />} />
      {/* Matching routes */}
      <Route path="/matching" element={<Matching />} />
      {/* Collaboration routes */}
      <Route
        path="/collaborate/:roomId"
        element={
          <SocketProvider>
            <CollaborationRoom isMatchingRoom={true} />
          </SocketProvider>
        }
      />
      <Route
        path="/practice/:roomId"
        element={
          <SocketProvider>
            <CollaborationRoom isMatchingRoom={false} />
          </SocketProvider>
        }
      />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default AuthenticatedApp;
