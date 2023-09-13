import { Spinner, Stack, useToast, Card } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import QuestionsAPI from '../../api/questions/questions';
import { useNavigate, useParams } from 'react-router-dom';
import { type AxiosError } from 'axios';
import { BiSolidBookAdd } from 'react-icons/bi';
import IconWithText from '../../components/content/IconWithText';
import QuestionForm from '../../components/content/QuestionForm';

export const UpdateQuestion: React.FC = () => {
  const { questionId } = useParams();
  let questionIdString: string;
  if (questionId !== undefined) {
    questionIdString = questionId;
  } else {
    throw new Error('ID of question is undefined');
  }
  const [title, setTitle] = useState('');
  const [questionDescription, setQuestionDescription] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [complexity, setComplexity] = useState('Easy');
  const [linkToQuestion, setLinkToQuestion] = useState('');
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false); // Add this state

  const toast = useToast();

  const linkPrefix = 'https://leetcode.com/problems/';

  const navigate = useNavigate();

  useEffect(() => {
    new QuestionsAPI()
      .getCategories()
      .then((categories) => {
        setAllCategories(categories);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    new QuestionsAPI()
      .getQuestion(questionIdString)
      .then((questionData) => {
        setTitle(questionData.title);
        setQuestionDescription(questionData.questionDescription);
        setCategories(questionData.categories);
        setComplexity(questionData.complexity);
        setLinkToQuestion(questionData.linkToQuestion.replace(linkPrefix, ''));
        setDataLoaded(true); // Mark data as loaded
      })
      .catch((error) => {
        console.error('Error fetching question data:', error);
        setDataLoaded(true);
      });
  }, []);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (categories.length === 0) {
      toast({
        title: 'Missing Categories!',
        description: 'Please fill in the question categories before submitting.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    new QuestionsAPI()
      .updateQuestion(questionIdString, {
        title,
        questionDescription,
        categories,
        complexity,
        linkToQuestion: linkPrefix + linkToQuestion,
      })
      .then(() => {
        navigate('/');
      })
      .catch((err: AxiosError<{ errors: Array<{ msg: string }> }>) => {
        const errors = err?.response?.data?.errors;
        if (errors !== undefined) {
          errors.map((error) =>
            toast({
              title: 'Question update failed.',
              description: error.msg,
              status: 'error',
              duration: 9000,
              isClosable: true,
            }),
          );
        }
      });
  };

  return (
    <Card m={12} p={8}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <IconWithText text="Update Question" icon={<BiSolidBookAdd size={25} />} fontSize={'2xl'} fontWeight="bold" />
          {dataLoaded ? (
            <QuestionForm
              title={title}
              setTitle={setTitle}
              questionDescription={questionDescription}
              setQuestionDescription={setQuestionDescription}
              categories={categories}
              setCategories={setCategories}
              complexity={complexity}
              setComplexity={setComplexity}
              linkToQuestion={linkToQuestion}
              setLinkToQuestion={setLinkToQuestion}
              allCategories={allCategories}
              dialogBody={'Are you sure? Any progress on the form will not be saved. This action is irreversible!'}
              dialogHeader={'Cancel Question Update'}
            />
          ) : (
            <Spinner size="xl" />
          )}
        </Stack>
      </form>
    </Card>
  );
};
