import React, { useEffect, useState } from 'react';
import { type OptionBase, Select, type ChakraStylesConfig } from 'chakra-react-select';

interface MultiSelectProps<T> {
  options: Array<Option<T>>;
  onChange: (selected: T[]) => void;
  initialOptions?: T[];
  title: string;
}

interface Option<T> extends OptionBase {
  label: string;
  value: T;
}

const MultiSelect = <T,>({ options, onChange, initialOptions, title }: MultiSelectProps<T>): JSX.Element => {
  const chakraStyles: ChakraStylesConfig<Option<T>, true> = {
    menu: (provided, state) => ({
      ...provided,
      zIndex: 2,
    }),
  };
  const [selectedOptions, setSelectedOptions] = useState<ReadonlyArray<Option<T>>>([]);
  const handleChange = (selectedOptions: ReadonlyArray<Option<T>>): void => {
    onChange(selectedOptions.map((option) => option.value));
    setSelectedOptions(selectedOptions);
  };

  useEffect(() => {
    if (initialOptions !== undefined)
      setSelectedOptions(options.filter((option) => initialOptions.includes(option.value)));
  }, [initialOptions]);

  return (
    <Select
      chakraStyles={chakraStyles}
      isMulti
      name="complexities"
      options={options}
      placeholder={title}
      closeMenuOnSelect={false}
      value={selectedOptions}
      onChange={handleChange}
    />
  );
};

export default MultiSelect;
