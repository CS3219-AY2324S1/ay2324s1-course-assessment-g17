import React, { useEffect, useState } from 'react';
import { Input, Button, Flex } from '@chakra-ui/react';

interface CustomNumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
}

const CustomNumberInput: React.FC<CustomNumberInputProps> = ({ value, onChange, min, max }: CustomNumberInputProps) => {
  const [inputValue, setInputValue] = useState(value.toString());

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  };

  const handleIncrement = (): void => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleDecrement = (): void => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleClear = (): void => {
    setInputValue('1');
    onChange(min);
  };

  const handleBlur = (): void => {
    const parsedValue = parseInt(inputValue, 10);
    if (!isNaN(parsedValue) && parsedValue >= min && parsedValue <= max) {
      onChange(parsedValue);
      setInputValue(parsedValue.toString());
    } else {
      setInputValue(value.toString());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  return (
    <Flex alignItems="center">
      <Button size="sm" ml={2} onClick={handleDecrement}>
        -
      </Button>
      <Input
        type="number"
        size="sm"
        style={{ width: '80px', textAlign: 'center' }}
        min={min}
        max={max}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown} // Trigger change on Enter key press
      />
      <Button size="sm" mr={2} onClick={handleIncrement}>
        +
      </Button>
      <Button size="sm" onClick={handleClear}>
        Clear
      </Button>
    </Flex>
  );
};

export default CustomNumberInput;
