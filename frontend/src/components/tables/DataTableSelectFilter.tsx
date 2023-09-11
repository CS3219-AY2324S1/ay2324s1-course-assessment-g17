import { type ColumnMeta, type Column } from '@tanstack/react-table';
import QuestionCategoryAutocomplete from '../questions/QuestionCategoryAutocomplete';
import React from 'react';
import { Select } from '@chakra-ui/react';

interface DataTableSelectFilterProps<T> {
  column: Column<T>;
}

interface DataTableSelectFilterColMeta<T, V> extends ColumnMeta<T, V> {
  /* The options to filter from, if not defined will be taken from row values */
  selectFilterOptions?: string[];
  selectOptionPrefix?: string;
}

const DataTableSelectFilter = <T extends object>({
  column: { getFilterValue, setFilterValue, id, columnDef },
}: DataTableSelectFilterProps<T>): JSX.Element => {
  const meta = columnDef.meta as DataTableSelectFilterColMeta<T, unknown> | undefined;
  const filterValue = getFilterValue() as string[] | undefined;
  const options = meta?.selectFilterOptions ?? [];

  return (
    <>
      {meta?.selectOptionPrefix === 'Category' ? (
        <QuestionCategoryAutocomplete handleChange={setFilterValue} categories={filterValue ?? []} showTags={false} />
      ) : (
        <Select
          value={filterValue}
          onChange={(e) => {
            setFilterValue(e.target.value ?? undefined);
          }}
          minWidth="fit-content"
        >
          <option value="">{`${meta?.selectOptionPrefix ?? id}: All`}</option>
          {options?.map((option, i) => (
            <option key={i} value={option}>
              {`${meta?.selectOptionPrefix ?? id}: ${option}`}
            </option>
          ))}
        </Select>
      )}
    </>
  );
};

export default DataTableSelectFilter;
