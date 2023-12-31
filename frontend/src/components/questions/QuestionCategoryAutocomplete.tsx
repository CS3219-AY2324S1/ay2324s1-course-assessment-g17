import React, { useEffect, useState } from 'react';
import QuestionsAPI from '../../api/questions/questions';
import MultiSelect from '../form/MultiSelect';

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
    <MultiSelect
      title="Select Categories..."
      options={allCategories.map((category) => {
        return { label: category, value: category };
      })}
      initialOptions={categories}
      onChange={handleChange}
    />
  );
};

export default QuestionCategoryAutocomplete;
