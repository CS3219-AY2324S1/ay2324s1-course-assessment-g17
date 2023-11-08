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
import Forum from '../forum/Forum';
import CreatePost from '../forum/CreatePost';
import CreateComment from '../forum/CreateComment';
import PostDetail from '../forum/PostDetail';
import { SocketProvider } from '../../context/socket';

const AuthenticatedApp: React.FC = () => {
  return (
    <Routes>
      {/* Question routes */}
      <Route path="/" element={<Home />} />
      <Route path="/questions/new" element={<ProtectedRoute child={<CreateQuestion />} />} />
      {/* <Route path="question/:questionId/edit" element={<UpdateQuestion />} /> */}
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
      {/* Forum routes */}
      <Route path="/forum" element={<Forum />} />
      <Route path="/forum/new-post" element={<CreatePost />} />
      <Route path="/forum/:postId" element={<PostDetail />} />
      <Route path="*" element={<PageNotFound />} />
      <Route path="/forum/:postId/new-comment" element={<CreateComment />} />
      {/* <Route path="/forum/:postId/:commentId/edit" element={<UpdateQuestion />} /> */}
    </Routes>
  );
};

export default AuthenticatedApp;
