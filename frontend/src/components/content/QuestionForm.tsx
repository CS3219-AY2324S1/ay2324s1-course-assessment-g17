import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Textarea,
  Flex,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
  AutoCompleteTag,
} from '@choc-ui/chakra-autocomplete';
import React from 'react';

import { useNavigate } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa6';
import ConfirmationDialog from '../../components/content/ConfirmationDialog';

interface QuestionFormProps {
  title: string;
  setTitle: (value: string) => void;
  questionDescription: string;
  setQuestionDescription: (value: string) => void;
  categories: string[];
  setCategories: (value: string[]) => void;
  complexity: string;
  setComplexity: (value: string) => void;
  linkToQuestion: string;
  setLinkToQuestion: (value: string) => void;
  allCategories: string[];
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  title,
  setTitle,
  questionDescription,
  setQuestionDescription,
  categories,
  setCategories,
  complexity,
  setComplexity,
  linkToQuestion,
  setLinkToQuestion,
  allCategories,
}) => {
  const linkPrefix = 'https://leetcode.com/problems/';
  const navigate = useNavigate();

  return (
    <>
      <HStack mt={2}>
        <FormControl isRequired width={'250%'}>
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
      </HStack>

      <FormControl isRequired>
        <FormLabel>Categories</FormLabel>
        <AutoComplete
          openOnFocus
          closeOnSelect
          multiple
          onChange={(categories) => {
            setCategories(categories as string[]);
          }}
          isLoading={allCategories.length === 0}
          suggestWhenEmpty
          restoreOnBlurIfEmpty={false}
          value={categories}
        >
          <AutoCompleteInput variant="filled" isRequired={false}>
            {({ tags }) =>
              tags.map((tag, tid) => <AutoCompleteTag key={tid} label={tag.label as string} onRemove={tag.onRemove} />)
            }
          </AutoCompleteInput>
          <AutoCompleteList>
            {allCategories.map((category, cid) => (
              <AutoCompleteItem
                key={`option-${cid}`}
                value={category}
                style={{ marginTop: 4, marginBottom: 4 }}
                _selected={{ bg: useColorModeValue('blackAlpha.50', 'whiteAlpha.50'), color: 'gray.500' }}
                _focus={{ bg: useColorModeValue('blackAlpha.100', 'whiteAlpha.100') }}
              >
                {category}
              </AutoCompleteItem>
            ))}
          </AutoCompleteList>
        </AutoComplete>
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

      <FormControl isRequired>
        <FormLabel>Description</FormLabel>
        <Textarea
          placeholder="Description of Leetcode question"
          _placeholder={{ color: useColorModeValue('gray.600', 'gray.400') }}
          value={questionDescription}
          onChange={(e) => {
            setQuestionDescription(e.target.value);
          }}
          required
          rows={8}
        />
      </FormControl>

      <Flex mt={4} justifyContent="space-between">
        <ConfirmationDialog
          dialogHeader="Cancel Question Creation"
          dialogBody="Are you sure? Any progress on the form will not be saved. This action is irreversible!"
          mainButtonLabel="Cancel"
          leftButtonLabel="No, stay on this form"
          rightButtonLabel="Yes, bring me back"
          onConfirm={() => {
            navigate('/');
          }}
        />
        <Button type="submit" colorScheme="teal" leftIcon={<FaCheck size={20} />}>
          Submit Question
        </Button>
      </Flex>
    </>
  );
};

export default QuestionForm;
