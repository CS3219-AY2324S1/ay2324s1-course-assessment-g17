// DONE EXCEPT FOR DISPLAYING POST CONTENT

import React, { useEffect, useState } from 'react';
import ForumAPI from '../../api/forum/forum';
import { useNavigate, useParams } from 'react-router-dom';
import CommentForm from '../../components/forum/CommentForm';
import PostDetailComponent from '../../components/forum/PostDetailComponent';
import { useAppSelector } from '../../reducers/hooks';
import { type CommentData } from '../../types/forum/forum';
import { selectUser } from '../../reducers/authSlice';

const EditComment: React.FC = () => {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const username = user?.username ?? '';

  const { postId } = useParams();
  if (postId === undefined) {
    throw new Error('ID of question is undefined');
  }

  const { commentId } = useParams();
  let commentIdNum: number;
  if (commentId !== undefined) {
    commentIdNum = Number(commentId);
  } else {
    throw new Error('ID of comment is undefined');
  }

  const [dataLoaded, setDataLoaded] = useState(false); // Add this state
  const [content, setContent] = useState<string>('');

  const commentData: CommentData = {
    content,
    postId,
    username,
  };

  useEffect(() => {
    new ForumAPI()
      .getComment(commentIdNum)
      .then((currComment) => {
        setContent(currComment.content);
        setDataLoaded(true); // Mark data as loaded
      })
      .catch((error) => {
        console.error('Error fetching comment data:', error);
        navigate('/404');
        setDataLoaded(true);
      });
  }, []);

  const handleData = async (commentData: CommentData): Promise<void> => {
    await new ForumAPI().editComment(commentIdNum, username, commentData);
  };

  return (
    <div style={{ width: '100%', alignItems: 'center' }}>
      <PostDetailComponent postId={postId} />
      <div style={{ width: '80%', alignItems: 'center', marginLeft: '10%', marginRight: '10%' }}>
        <CommentForm
          formTitle={'Edit Comment'}
          postId={postId}
          dialogBody={'Are you sure? Your comment will not be saved!'}
          dialogHeader={'Cancel Comment Edit'}
          isLoading={!dataLoaded}
          initialData={commentData}
          handleData={handleData}
          errorTitle={'Comment editing failed.'}
          submitButtonLabel={'Submit Edit'}
        />
      </div>
    </div>
  );
};

export default EditComment;
