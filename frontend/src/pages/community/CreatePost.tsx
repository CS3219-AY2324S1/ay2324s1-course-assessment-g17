import React from 'react';
import PostForm from './PostForm';

export const CreatePost: React.FC = () => {
  return (
    <PostForm
      formTitle={'Create Post'}
      dialogBody={'Are you sure? Any progress on the form will not be saved. This action is irreversible!'}
      dialogHeader={'Cancel Question Creation'}
      submitButtonLabel={'Submit Post'}
    />
  );
};
