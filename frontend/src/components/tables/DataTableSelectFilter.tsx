import { type Column } from '@tanstack/react-table';
import QuestionCategoryAutocomplete from '../questions/QuestionCategoryAutocomplete';
import React from 'react';

interface DataTableSelectFilterProps<T> {
  column: Column<T>;
}

const DataTableSelectFilter = <T extends object>({
  column: { getFilterValue, setFilterValue },
}: DataTableSelectFilterProps<T>): JSX.Element => {
  const filterValue = getFilterValue() as string[] | undefined;

  return (
    <>
      <QuestionCategoryAutocomplete handleChange={setFilterValue} categories={filterValue ?? []} showTags={false} />
    </>
  );
};

export default DataTableSelectFilter;
