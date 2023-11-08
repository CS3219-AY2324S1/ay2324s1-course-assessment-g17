// DONE EXCEPT FOR DISPLAYING POST CONTENT

import React from 'react';
import ForumAPI from '../../api/forum/forum';
// import { Stack } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import CommentForm from '../../components/forum/CommentForm';
import PostDetailComponent from '../../components/forum/PostDetailComponent';
import { type CommentData } from '../../types/forum/forum';

const CreateComment: React.FC = () => {
  const { postId } = useParams();

  let postIdNum: number;
  if (postId !== undefined) {
    postIdNum = Number(postId);
  } else {
    throw new Error('ID of question is undefined');
  }

  const handleData = async (commentData: CommentData): Promise<void> => {
    await new ForumAPI().addComment(postIdNum, commentData);
  };

  //   addComment(postId: number, data: any) {
  //   return forumServiceClient.post(`${this.getForumUrl()}/${postId}/comments`, data);
  // }

  return (
    <div style={{ width: '100%', alignItems: 'center' }}>
      <PostDetailComponent postId={postId} />
      <div style={{ width: '80%', alignItems: 'center', marginLeft: '10%', marginRight: '10%' }}>
        <CommentForm
          formTitle={'Create Comment'}
          postId={postId}
          dialogBody={'Are you sure? Your comment will not be saved!'}
          dialogHeader={'Cancel Comment Creation'}
          handleData={handleData}
          errorTitle={'Comment creation failed.'}
          submitButtonLabel={'Submit Comment'}
        />
      </div>
    </div>
  );
};

export default CreateComment;
