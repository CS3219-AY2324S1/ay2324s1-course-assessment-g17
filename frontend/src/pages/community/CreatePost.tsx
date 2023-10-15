import React from 'react';
import PostForm from './PostForm';

export const CreatePost: React.FC = () => {
  return (
    <PostForm
      formTitle={'Create Post'}
      dialogBody={'Are you sure? Your post will not be saved!'}
      dialogHeader={'Cancel Post Creation'}
      submitButtonLabel={'Submit Post'}
    />
  );
};
