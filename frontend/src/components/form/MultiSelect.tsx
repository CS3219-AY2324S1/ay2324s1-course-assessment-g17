import React, { useEffect, useState } from 'react';
import { type OptionBase, Select } from 'chakra-react-select';

interface MultiSelectProps<T> {
  options: Array<Option<T>>;
  onChange: (selected: T[]) => void;
  initialOptions?: Array<Option<T>>;
}

interface Option<T> extends OptionBase {
  label: string;
  value: T;
}

const MultiSelect = <T,>({ options, onChange, initialOptions }: MultiSelectProps<T>): JSX.Element => {
  const [selectedOptions, setSelectedOptions] = useState<ReadonlyArray<Option<T>>>([]);
  const handleChange = (selectedOptions: ReadonlyArray<Option<T>>): void => {
    onChange(selectedOptions.map((option) => option.value));
    setSelectedOptions(selectedOptions);
  };

  useEffect(() => {
    if (initialOptions !== undefined) setSelectedOptions(initialOptions);
  }, [initialOptions]);

  return (
    <Select
      isMulti
      name="complexities"
      options={options}
      placeholder="Select difficulty..."
      closeMenuOnSelect={false}
      value={selectedOptions}
      onChange={handleChange}
    />
  );
};

export default MultiSelect;
