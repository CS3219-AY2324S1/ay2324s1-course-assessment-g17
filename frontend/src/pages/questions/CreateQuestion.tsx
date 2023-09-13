import { Card, Stack, useToast } from '@chakra-ui/react';
import { BiSolidBookAdd } from 'react-icons/bi';
import React, { useEffect, useState } from 'react';
import QuestionsAPI from '../../api/questions/questions';
import { useNavigate } from 'react-router-dom';
import { type AxiosError } from 'axios';
import IconWithText from '../../components/content/IconWithText';
import QuestionForm from '../../components/content/QuestionForm';

export const CreateQuestion: React.FC = () => {
  const [title, setTitle] = useState('');
  const [questionDescription, setQuestionDescription] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [complexity, setComplexity] = useState('Easy');
  const [linkToQuestion, setLinkToQuestion] = useState('');
  const [allCategories, setAllCategories] = useState<string[]>([]);

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
      .addQuestion({ title, questionDescription, categories, complexity, linkToQuestion: linkPrefix + linkToQuestion })
      .then(() => {
        navigate('/');
      })
      .catch((err: AxiosError<{ errors: Array<{ msg: string }> }>) => {
        const errors = err?.response?.data?.errors;
        if (errors !== undefined) {
          errors.map((error) =>
            toast({
              title: 'Question creation failed.',
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
          <IconWithText text="Create Question" icon={<BiSolidBookAdd size={25} />} fontSize={'2xl'} fontWeight="bold" />
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
            dialogHeader={'Cancel Question Creation'}
          />
        </Stack>
      </form>
    </Card>
  );
};
