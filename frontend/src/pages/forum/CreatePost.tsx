import React from 'react';
import ForumAPI from '../../api/forum/forum';
import PostForm from './PostForm';
import { type ForumPostData } from '../../types/forum/forum';

const CreatePost: React.FC = () => {
  const handleData = async (forumData: ForumPostData): Promise<void> => {
    await new ForumAPI().addPost(forumData);
  };

  return (
    <PostForm
      formTitle={'Create Post'}
      dialogBody={'Are you sure? Your post will not be saved!'}
      dialogHeader={'Cancel Post Creation'}
      handleData={handleData}
      errorTitle={'Post creation failed.'}
      submitButtonLabel={'Submit Post'}
    />
  );
};

export default CreatePost;
