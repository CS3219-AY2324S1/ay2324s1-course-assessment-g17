import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
  AutoCompleteTag,
} from '@choc-ui/chakra-autocomplete';
import React, { useEffect, useState } from 'react';
import QuestionsAPI from '../../api/questions/questions';

interface QuestionCategoryAutocompleteProps {
  categories: string[];
  handleChange: (categories: string[]) => void;
}

const QuestionCategoryAutocomplete = ({ categories, handleChange }: QuestionCategoryAutocompleteProps): JSX.Element => {
  const [allCategories, setAllCategories] = useState<string[]>([]);
  useEffect(() => {
    new QuestionsAPI()
      .getCategories()
      .then((categories) => {
        setAllCategories(categories);
      })
      .catch(console.error);
  }, []);

  return (
    <AutoComplete
      openOnFocus
      closeOnSelect
      closeOnBlur
      multiple
      value={categories}
      onChange={(categories) => {
        handleChange(categories as string[]);
      }}
      isLoading={allCategories.length === 0}
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
            _selected={{ bg: 'whiteAlpha.50' }}
            _focus={{ bg: 'whiteAlpha.100' }}
          >
            {category}
          </AutoCompleteItem>
        ))}
      </AutoCompleteList>
    </AutoComplete>
  );
};

export default QuestionCategoryAutocomplete;
