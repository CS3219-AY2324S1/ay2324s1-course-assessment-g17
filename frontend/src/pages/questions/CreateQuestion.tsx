import React from 'react';
import QuestionsAPI from '../../api/questions/questions';
import QuestionForm from '../../components/content/QuestionForm';
import { type QuestionPostData } from '../../types/questions/questions';

export const CreateQuestion: React.FC = () => {
  const handleData = async (questionData: QuestionPostData): Promise<void> =>
    await new QuestionsAPI().addQuestion(questionData);

  return (
    <QuestionForm
      formTitle={'Create Question'}
      dialogBody={'Are you sure? Any progress on the form will not be saved. This action is irreversible!'}
      dialogHeader={'Cancel Question Creation'}
      handleData={handleData}
      errorTitle={'Question creation failed.'}
    />
  );
};
