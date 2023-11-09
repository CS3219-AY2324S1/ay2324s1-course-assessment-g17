import React, { useEffect, useState } from 'react';
import ForumAPI from '../../api/forum/forum';
import { useNavigate, useParams } from 'react-router-dom';
import ForumPostForm from '../../components/forum/PostForm';
import { type ForumPostData, type ForumData } from '../../types/forum/forum';

const EditPost: React.FC = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  let postIdNum: number;
  if (postId !== undefined) {
    postIdNum = Number(postId);
  } else {
    throw new Error('ID of the forum post is undefined');
  }

  const [dataLoaded, setDataLoaded] = useState(false);
  const [postData, setPostData] = useState<ForumData | null>(null);

  useEffect(() => {
    new ForumAPI()
      .viewPost(postIdNum)
      .then((postData) => {
        setPostData({ ...postData }); // Update with forum post data structure
        setDataLoaded(true);
      })
      .catch((error) => {
        console.error('Error fetching forum post data:', error);
        navigate('/404');
        setDataLoaded(true);
      });
  }, []);

  const handleData = async (postData: ForumPostData): Promise<void> => {
    await new ForumAPI().editPost(postIdNum, postData);
  };

  return (
    <ForumPostForm
      formTitle={'Edit Forum Post'}
      dialogBody={'Are you sure? Any progress on the form will not be saved. This action is irreversible!'}
      dialogHeader={'Cancel Post Edit'}
      handleData={handleData}
      isLoading={!dataLoaded}
      initialData={postData}
      errorTitle={'Post edit failed.'}
      submitButtonLabel={'Update Post'}
    />
  );
};

export default EditPost;
