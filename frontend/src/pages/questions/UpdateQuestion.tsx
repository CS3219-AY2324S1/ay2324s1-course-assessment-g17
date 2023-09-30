import React, { useEffect, useState } from 'react';
import QuestionsAPI from '../../api/questions/questions';
import { useNavigate, useParams } from 'react-router-dom';
import QuestionForm from '../../components/content/QuestionForm';
import { LINK_PREFIX, type QuestionPostData, type QuestionData } from '../../types/questions/questions';

export const UpdateQuestion: React.FC = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();

  let questionIdString: string;
  if (questionId !== undefined) {
    questionIdString = questionId;
  } else {
    throw new Error('ID of question is undefined');
  }

  const [dataLoaded, setDataLoaded] = useState(false); // Add this state
  const [questionData, setQuestionData] = useState<QuestionData | null>(null);

  useEffect(() => {
    new QuestionsAPI()
      .getQuestion(questionIdString)
      .then((questionData) => {
        setQuestionData({ ...questionData, linkToQuestion: questionData.linkToQuestion.replace(LINK_PREFIX, '') });
        setDataLoaded(true); // Mark data as loaded
      })
      .catch((error) => {
        console.error('Error fetching question data:', error);
        navigate('/404');
        setDataLoaded(true);
      });
  }, []);

  const handleData = async (questionData: QuestionPostData): Promise<QuestionData> =>
    await new QuestionsAPI().updateQuestion(questionIdString, questionData);

  return (
    <QuestionForm
      formTitle={'Update Question'}
      dialogBody={'Are you sure? Any progress on the form will not be saved. This action is irreversible!'}
      dialogHeader={'Cancel Question Update'}
      handleData={handleData}
      isLoading={!dataLoaded}
      initialData={questionData}
      errorTitle={'Question update failed.'}
      submitButtonLabel={'Update Question'}
    />
  );
};
