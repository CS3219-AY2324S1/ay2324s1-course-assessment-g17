import {
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Stack,
  Textarea,
  useToast,
} from '@chakra-ui/react';

import React, { useState } from 'react';
import QuestionsAPI from '../../api/questions/questions';
import { useNavigate } from 'react-router-dom';
import { type AxiosError } from 'axios';
import QuestionCategoryAutocomplete from '../../components/questions/QuestionCategoryAutocomplete';

export const CreateQuestion: React.FC = () => {
  const [title, setTitle] = useState('');
  const [questionDescription, setQuestionDescription] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [complexity, setComplexity] = useState('Easy');
  const [linkToQuestion, setLinkToQuestion] = useState('');

  const toast = useToast();

  const linkPrefix = 'https://leetcode.com/problems/';

  const navigate = useNavigate();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
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
    <Container>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <Heading size={'2xl'} mb={4} mt={8}>
            Create Question
          </Heading>
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              required
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea
              placeholder="Description of leetcode question"
              value={questionDescription}
              onChange={(e) => {
                setQuestionDescription(e.target.value);
              }}
              required
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Categories</FormLabel>
            <QuestionCategoryAutocomplete categories={categories} handleChange={setCategories} showTags={true} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Complexity</FormLabel>
            <Select
              value={complexity}
              onChange={(e) => {
                setComplexity(e.target.value);
              }}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Link to Question</FormLabel>
            <InputGroup>
              <InputLeftAddon>{linkPrefix}</InputLeftAddon>
              <Input
                value={linkToQuestion}
                onChange={(e) => {
                  setLinkToQuestion(e.target.value);
                }}
              />
            </InputGroup>
          </FormControl>
          <Button type="submit" colorScheme="teal">
            Submit
          </Button>
        </Stack>
      </form>
    </Container>
  );
};
