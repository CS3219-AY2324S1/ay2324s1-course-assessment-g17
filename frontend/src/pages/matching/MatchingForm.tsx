import React, { useState } from 'react';
import { Button, FormControl, FormLabel, HStack, Stack } from '@chakra-ui/react';
import QuestionCategoryAutocomplete from '../../components/questions/QuestionCategoryAutocomplete';
import { QuestionComplexityEnum } from '../../types/questions/questions';
import { FaBoltLightning } from 'react-icons/fa6';
import MultiSelect from '../../components/form/MultiSelect';

interface MatchingFormProps {
  handleMatchRequest: (complexities: readonly QuestionComplexityEnum[], categories: string[]) => void;
}

const MatchingForm: React.FC<MatchingFormProps> = ({ handleMatchRequest }) => {
  const [complexities, setComplexities] = useState<readonly QuestionComplexityEnum[]>([QuestionComplexityEnum.EASY]);
  const [categories, setCategories] = useState<string[]>([]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    handleMatchRequest(complexities, categories);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={4}>
        <HStack mt={2}>
          <FormControl isRequired>
            <FormLabel>Complexity</FormLabel>
            <MultiSelect
              options={[
                { label: 'Easy', value: QuestionComplexityEnum.EASY },
                { label: 'Medium', value: QuestionComplexityEnum.MEDIUM },
                { label: 'Hard', value: QuestionComplexityEnum.HARD },
              ]}
              onChange={setComplexities}
            />
          </FormControl>
        </HStack>

        <FormControl isRequired>
          <FormLabel>Categories</FormLabel>
          <QuestionCategoryAutocomplete categories={categories} handleChange={setCategories} />
        </FormControl>
        <Button type="submit" colorScheme="teal" leftIcon={<FaBoltLightning size={20} />}>
          Find a match!
        </Button>
      </Stack>
    </form>
  );
};

export default MatchingForm;
