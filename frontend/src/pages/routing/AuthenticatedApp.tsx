import AuthAPI from '../../api/users/auth';
import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { CreateQuestion } from '../questions/CreateQuestion';
import Questions from '../questions/Questions';
import { UpdateQuestion } from '../questions/UpdateQuestion';
import ViewQuestion from '../questions/ViewQuestion';
import PageNotFound from './NotFound';

const AuthenticatedApp: React.FC = () => {
  // const location = useLocation();
  // const authApi = new AuthAPI();

  // useEffect(() => {
  //   const fetchData = async () => {
  // //     try {
  // //       // Ensure that useRefreshToken is awaited
  //       await authApi.useRefreshToken();

  // //       // Now you can make additional API calls after refreshing the token
  // //       const user = await authApi.getCurrentUser();
  // //       console.log(`Fresh token granted for ${user.username}`);

  // //       // Code to run when the route changes
  // //       console.log('Page changed:', location.pathname);
  // //     } catch (error) {
  // //       console.error('Error:', error);
  // //     }
  //   };

  // //   // Call the async function immediately using an IIFE
  //   fetchData();
  // }, [location]); // Ensures effect runs when the route changes

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
